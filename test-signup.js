const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth/signup';

async function runTests() {
  console.log('🧪 Running Signup Endpoint Tests...\n');
  
  let testNumber = 1;
  let passedTests = 0;
  let totalTests = 0;

  // Helper function to run a test
  async function runTest(testName, userData, expectedStatus, expectedMessage) {
    totalTests++;
    console.log(`${testNumber}. ${testName}`);
    
    try {
      const response = await axios.post(BASE_URL, userData);
      
      if (response.status === expectedStatus) {
        console.log(`   ✅ PASS - Status: ${response.status}`);
        if (expectedMessage && response.data.message) {
          console.log(`   ✅ Message: "${response.data.message}"`);
        }
        passedTests++;
      } else {
        console.log(`   ❌ FAIL - Expected status ${expectedStatus}, got ${response.status}`);
      }
    } catch (error) {
      if (error.response && error.response.status === expectedStatus) {
        console.log(`   ✅ PASS - Status: ${error.response.status}`);
        if (expectedMessage && error.response.data.error) {
          console.log(`   ✅ Error: "${error.response.data.error}"`);
        }
        passedTests++;
      } else {
        console.log(`   ❌ FAIL - Expected status ${expectedStatus}, got ${error.response?.status || 'unknown'}`);
        console.log(`   Error: ${error.response?.data?.error || error.message}`);
      }
    }
    
    testNumber++;
    console.log('');
  }

  // Test 1: Successful registration
  await runTest(
    'Successful user registration',
    {
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: 'password123',
      termsAccepted: true
    },
    201,
    'User registered successfully'
  );

  // Test 2: Missing name
  await runTest(
    'Missing name validation',
    {
      email: 'test@example.com',
      password: 'password123',
      termsAccepted: true
    },
    400,
    'All fields are required: name, email, password, and termsAccepted'
  );

  // Test 3: Missing email
  await runTest(
    'Missing email validation',
    {
      name: 'Test User',
      password: 'password123',
      termsAccepted: true
    },
    400,
    'All fields are required: name, email, password, and termsAccepted'
  );

  // Test 4: Missing password
  await runTest(
    'Missing password validation',
    {
      name: 'Test User',
      email: 'test@example.com',
      termsAccepted: true
    },
    400,
    'All fields are required: name, email, password, and termsAccepted'
  );

  // Test 5: Missing termsAccepted
  await runTest(
    'Missing termsAccepted validation',
    {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    },
    400,
    'All fields are required: name, email, password, and termsAccepted'
  );

  // Test 6: Invalid email format
  await runTest(
    'Invalid email format validation',
    {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
      termsAccepted: true
    },
    400,
    'Invalid email format'
  );

  // Test 7: Password too short
  await runTest(
    'Password length validation',
    {
      name: 'Test User',
      email: 'test2@example.com',
      password: '123',
      termsAccepted: true
    },
    400,
    'Password must be at least 6 characters long'
  );

  // Test 8: Terms not accepted
  await runTest(
    'Terms acceptance validation',
    {
      name: 'Test User',
      email: 'test3@example.com',
      password: 'password123',
      termsAccepted: false
    },
    400,
    'Terms and conditions must be accepted'
  );

  // Test 9: Duplicate email
  await runTest(
    'Duplicate email validation',
    {
      name: 'Jane Doe',
      email: 'john.doe@test.com', // Same email as Test 1
      password: 'password123',
      termsAccepted: true
    },
    409,
    'User with this email already exists'
  );

  // Test 10: Another successful registration
  await runTest(
    'Another successful registration',
    {
      name: 'Alice Smith',
      email: 'alice.smith@test.com',
      password: 'securepass123',
      termsAccepted: true
    },
    201,
    'User registered successfully'
  );

  // Summary
  console.log('📊 TEST SUMMARY');
  console.log('================');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! The signup endpoint is working correctly.');
  } else {
    console.log('\n❌ Some tests failed. Please check the implementation.');
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:5000/api/auth/signup');
    return true;
  } catch (error) {
    // We expect a 404 or similar error for GET request to POST endpoint
    // This just means the server is running
    return error.response && error.response.status !== undefined;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking if server is running...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ Server is not running on port 5000');
    console.log('Please start the server first:');
    console.log('   npx ts-node backend/src/server.ts');
    return;
  }
  
  console.log('✅ Server is running\n');
  await runTests();
}

main().catch(console.error); 