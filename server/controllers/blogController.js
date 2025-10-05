// Контролер блогу
const BlogPost = require('../models/BlogPost');

// ========== ПУБЛІЧНІ МЕТОДИ ==========

// Отримання всіх опублікованих статей
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const category = req.query.category || '';
    const skip = (page - 1) * limit;

    let query = { status: 'published' };
    if (category) {
      query.category = category;
    }

    const posts = await BlogPost.find(query)
      .select('-content') // Не відправляємо повний контент у списку
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await BlogPost.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Помилка отримання статей' });
  }
};

// Отримання статті за slug
exports.getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      status: 'published'
    });

    if (!post) {
      return res.status(404).json({ message: 'Статтю не знайдено' });
    }

    // Збільшити лічильник переглядів
    post.views += 1;
    await post.save();

    // Отримати схожі статті
    const relatedPosts = await BlogPost.find({
      _id: { $ne: post._id },
      status: 'published',
      $or: [
        { category: post.category },
        { tags: { $in: post.tags } }
      ]
    })
      .select('-content')
      .limit(3)
      .sort({ publishedAt: -1 });

    res.json({
      post,
      relatedPosts
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Помилка отримання статті' });
  }
};

// ========== АДМІНІСТРАТИВНІ МЕТОДИ ==========

// Отримання всіх статей для адміна (включаючи чернетки)
exports.getAdminPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await BlogPost.find()
      .select('-content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await BlogPost.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts
    });

  } catch (error) {
    console.error('Get admin posts error:', error);
    res.status(500).json({ message: 'Помилка отримання статей' });
  }
};

// Отримання статті за ID для редагування
exports.getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Статтю не знайдено' });
    }

    res.json({ post });

  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({ message: 'Помилка отримання статті' });
  }
};

// Створення нової статті
exports.createPost = async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author: req.admin.name || 'disCard Team',
      publishedAt: req.body.status === 'published' ? new Date() : null,
      readTime: calculateReadTime(req.body.content)
    };

    const post = await BlogPost.create(postData);

    res.status(201).json({
      success: true,
      post
    });

  } catch (error) {
    console.error('Create post error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slug вже існує' });
    }
    res.status(500).json({ message: 'Помилка створення статті' });
  }
};

// Оновлення статті
exports.updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Статтю не знайдено' });
    }

    // Якщо змінюємо статус на published і це перша публікація
    if (req.body.status === 'published' && !post.publishedAt) {
      req.body.publishedAt = new Date();
    }

    // Оновити readTime якщо змінився контент
    if (req.body.content) {
      req.body.readTime = calculateReadTime(req.body.content);
    }

    req.body.updatedAt = new Date();

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      post: updatedPost
    });

  } catch (error) {
    console.error('Update post error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slug вже існує' });
    }
    res.status(500).json({ message: 'Помилка оновлення статті' });
  }
};

// Видалення статті
exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Статтю не знайдено' });
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Статтю видалено'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Помилка видалення статті' });
  }
};

// Допоміжна функція для розрахунку часу читання
function calculateReadTime(content) {
  const wordsPerMinute = 200; // Середня швидкість читання
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return time || 1; // Мінімум 1 хвилина
}
