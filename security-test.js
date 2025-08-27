#!/usr/bin/env node

/**
 * Basic Security Tests for Loyalty Cards App
 * Run: node security-test.js
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

console.log('🔍 Starting security tests...\n');

// Test 1: Security Headers
async function testSecurityHeaders() {
  console.log('1. Testing security headers...');
  
  try {
    const response = await fetch(BASE_URL);
    const headers = Object.fromEntries(response.headers.entries());
    
    const expectedHeaders = [
      'x-frame-options',
      'x-content-type-options', 
      'referrer-policy',
      'permissions-policy'
    ];
    
    let passed = 0;
    expectedHeaders.forEach(header => {
      if (headers[header]) {
        console.log(`   ✅ ${header}: ${headers[header]}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${header}`);
      }
    });
    
    console.log(`   Result: ${passed}/${expectedHeaders.length} headers present\n`);
  } catch (error) {
    console.log(`   ❌ Error testing headers: ${error.message}\n`);
  }
}

// Test 2: Rate Limiting
async function testRateLimit() {
  console.log('2. Testing rate limiting...');
  
  try {
    const promises = [];
    for (let i = 0; i < 15; i++) {
      promises.push(
        fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@test.com', password: 'test' })
        })
      );
    }
    
    const responses = await Promise.all(promises);
    const rateLimited = responses.filter(r => r.status === 429);
    
    if (rateLimited.length > 0) {
      console.log(`   ✅ Rate limiting active (${rateLimited.length} requests blocked)`);
    } else {
      console.log(`   ⚠️  Rate limiting may not be working`);
    }
    console.log();
  } catch (error) {
    console.log(`   ❌ Error testing rate limit: ${error.message}\n`);
  }
}

// Test 3: Input Sanitization
async function testInputSanitization() {
  console.log('3. Testing input sanitization...');
  
  const maliciousInputs = [
    '<script>alert("xss")</script>',
    '{ "$ne": null }',
    '\'; DROP TABLE users; --'
  ];
  
  for (const input of maliciousInputs) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: input, password: 'test' })
      });
      
      if (response.status === 400) {
        console.log(`   ✅ Malicious input rejected: ${input.substring(0, 20)}...`);
      } else {
        console.log(`   ⚠️  Input may not be properly sanitized: ${input.substring(0, 20)}...`);
      }
    } catch (error) {
      console.log(`   ❌ Error testing input: ${error.message}`);
    }
  }
  console.log();
}

// Test 4: HTTPS Redirect (if applicable)
async function testHTTPS() {
  console.log('4. Testing HTTPS configuration...');
  
  if (BASE_URL.startsWith('https://')) {
    console.log('   ✅ Using HTTPS URL');
  } else {
    console.log('   ⚠️  Using HTTP - ensure HTTPS in production');
  }
  console.log();
}

// Test 5: Error Handling
async function testErrorHandling() {
  console.log('5. Testing error handling...');
  
  try {
    const response = await fetch(`${API_BASE}/nonexistent-endpoint`);
    const body = await response.text();
    
    if (!body.includes('Error:') && !body.includes('stack')) {
      console.log('   ✅ Error details not exposed');
    } else {
      console.log('   ❌ Error details may be exposed');
    }
  } catch (error) {
    console.log(`   ❌ Error testing error handling: ${error.message}`);
  }
  console.log();
}

// Run all tests
async function runSecurityTests() {
  try {
    await testSecurityHeaders();
    await testRateLimit();
    await testInputSanitization();
    await testHTTPS();
    await testErrorHandling();
    
    console.log('🎉 Security testing completed!');
    console.log('\n📋 Recommendations:');
    console.log('   1. Run npm audit for dependency vulnerabilities');
    console.log('   2. Use OWASP ZAP for comprehensive scanning');  
    console.log('   3. Enable HTTPS in production');
    console.log('   4. Monitor logs for suspicious activity');
    console.log('   5. Regular security updates');
    
  } catch (error) {
    console.error('❌ Security test failed:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  runSecurityTests();
}

module.exports = {
  runSecurityTests,
  testSecurityHeaders,
  testRateLimit,
  testInputSanitization
};