import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');

    // Test login
    console.log('1. Testing login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@lofi-cafe.com',
      password: 'admin123'
    });
    console.log('✅ Login successful');
    console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');
    console.log('User:', loginResponse.data.user.username);
    
    const token = loginResponse.data.token;

    // Test analytics
    console.log('\n2. Testing analytics...');
    const analyticsResponse = await axios.get(`${API_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Analytics successful');
    console.log('Data:', analyticsResponse.data);

    // Test users
    console.log('\n3. Testing users...');
    const usersResponse = await axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Users successful');
    console.log('Total users:', usersResponse.data.total);

    // Test tracks
    console.log('\n4. Testing tracks...');
    const tracksResponse = await axios.get(`${API_URL}/admin/tracks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Tracks successful');
    console.log('Total tracks:', tracksResponse.data.total);

    // Test playlists
    console.log('\n5. Testing playlists...');
    const playlistsResponse = await axios.get(`${API_URL}/admin/playlists`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Playlists successful');
    console.log('Total playlists:', playlistsResponse.data.total);

    // Test reports
    console.log('\n6. Testing reports...');
    const reportsResponse = await axios.get(`${API_URL}/admin/reports`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Reports successful');
    console.log('Total reports:', reportsResponse.data.total);

    // Test settings
    console.log('\n7. Testing settings...');
    const settingsResponse = await axios.get(`${API_URL}/admin/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Settings successful');
    console.log('Settings:', settingsResponse.data);

    console.log('\n🎉 All API tests passed!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testAPI(); 