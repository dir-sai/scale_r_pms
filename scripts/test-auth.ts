import { AuthService } from '../lib/api/auth';

async function testAuthentication() {
  try {
    console.log('Testing authentication setup...\n');

    // Test registration
    console.log('1. Testing user registration...');
    const registerData = {
      email: 'test@example.com',
      password: 'Test123!@#',
      firstName: 'Test',
      lastName: 'User',
      role: 'tenant' as const,
    };
    const registerResponse = await AuthService.register(registerData);
    console.log('✓ Registration successful');
    console.log('User ID:', registerResponse.user.id);

    // Test login
    console.log('\n2. Testing user login...');
    const loginResponse = await AuthService.login({
      email: registerData.email,
      password: registerData.password,
    });
    console.log('✓ Login successful');
    console.log('Token received:', loginResponse.token.substring(0, 20) + '...');

    // Test profile update
    console.log('\n3. Testing profile update...');
    const updatedProfile = await AuthService.updateProfile({
      phoneNumber: '+1234567890',
    });
    console.log('✓ Profile updated successfully');
    console.log('Updated phone number:', updatedProfile.phoneNumber);

    // Test password reset
    console.log('\n4. Testing password reset...');
    await AuthService.resetPassword({ email: registerData.email });
    console.log('✓ Password reset email sent');

    // Test Google sign-in configuration
    console.log('\n5. Verifying Google sign-in configuration...');
    if (process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID) {
      console.log('✓ Google Client ID is configured');
    } else {
      console.log('⚠ Google Client ID is not configured');
    }

    // Test Facebook sign-in configuration
    console.log('\n6. Verifying Facebook sign-in configuration...');
    if (process.env.EXPO_PUBLIC_FACEBOOK_APP_ID) {
      console.log('✓ Facebook App ID is configured');
    } else {
      console.log('⚠ Facebook App ID is not configured');
    }

    console.log('\n✓ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testAuthentication(); 