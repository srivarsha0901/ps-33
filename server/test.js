const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:3000';

async function testHealth() {
  try {
    console.log('🏥 Testing server health...');
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is healthy:', response.data.status);
    console.log('📊 Features:', response.data.features);
    console.log('🔧 Services:', response.data.services);
    return true;
  } catch (error) {
    console.log('❌ Server health check failed:', error.message);
    return false;
  }
}

async function testEmailGeneration() {
  try {
    console.log('\n🤖 Testing email generation...');
    const response = await axios.post(`${BASE_URL}/api/generate-email`, {
      topic: 'Test Email Generation',
      emailType: 'newsletter',
      tone: 'professional'
    });
    
    console.log('✅ Email generated successfully');
    console.log('📧 Subject:', response.data.subject);
    console.log('📄 Content length:', response.data.html.length, 'characters');
    console.log('✅ Validation:', response.data.validation.isValid ? 'Passed' : 'Failed');
    
    return response.data;
  } catch (error) {
    console.log('❌ Email generation failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testEmailValidation() {
  try {
    console.log('\n📧 Testing email validation...');
    const testEmails = [
      'test@example.com',
      'invalid-email',
      'another@test.com',
      'test@example.com' // duplicate
    ];
    
    const response = await axios.post(`${BASE_URL}/validate-emails`, {
      emails: testEmails
    });
    
    console.log('✅ Email validation completed');
    console.log('✅ Valid emails:', response.data.valid.length);
    console.log('❌ Invalid emails:', response.data.invalid.length);
    console.log('⚠️ Duplicate emails:', response.data.duplicates.length);
    
    return response.data;
  } catch (error) {
    console.log('❌ Email validation failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testTemplates() {
  try {
    console.log('\n📋 Testing template system...');
    const response = await axios.get(`${BASE_URL}/api/templates`);
    
    console.log('✅ Templates loaded successfully');
    console.log('📧 Email types:', response.data.available_types);
    console.log('🎭 Available tones:', response.data.available_tones);
    
    return response.data;
  } catch (error) {
    console.log('❌ Template system failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testSingleEmailSending() {
  try {
    console.log('\n📤 Testing single email sending...');
    
    // First generate an email
    const generatedEmail = await testEmailGeneration();
    if (!generatedEmail) {
      console.log('❌ Cannot test email sending without generated content');
      return false;
    }
    
    // Test sending (use a test email if available)
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    
    const response = await axios.post(`${BASE_URL}/send-email`, {
      to: testEmail,
      subject: generatedEmail.subject,
      html: generatedEmail.html
    });
    
    console.log('✅ Single email sent successfully');
    console.log('📧 Message ID:', response.data.messageId);
    
    return true;
  } catch (error) {
    console.log('❌ Single email sending failed:', error.response?.data?.message || error.message);
    console.log('💡 This might be expected if email credentials are not configured');
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 Enhanced Email System Test Suite');
  console.log('===================================\n');
  
  const results = {
    health: await testHealth(),
    generation: await testEmailGeneration(),
    validation: await testEmailValidation(),
    templates: await testTemplates(),
    sending: await testSingleEmailSending()
  };
  
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log('🏥 Server Health:', results.health ? '✅ PASS' : '❌ FAIL');
  console.log('🤖 Email Generation:', results.generation ? '✅ PASS' : '❌ FAIL');
  console.log('📧 Email Validation:', results.validation ? '✅ PASS' : '❌ FAIL');
  console.log('📋 Template System:', results.templates ? '✅ PASS' : '❌ FAIL');
  console.log('📤 Email Sending:', results.sending ? '✅ PASS' : '❌ FAIL');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your email system is ready to use.');
  } else {
    console.log('⚠️ Some tests failed. Please check your configuration.');
    console.log('📚 See EMAIL_SETUP.md for detailed setup instructions.');
  }
  
  return results;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  testHealth,
  testEmailGeneration,
  testEmailValidation,
  testTemplates,
  testSingleEmailSending,
  runAllTests
}; 