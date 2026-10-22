const axios = require('axios');

async function testBackendOrder() {
  const baseURL = 'http://localhost:3000';
  let token = null;

  try {
    const regRes = await axios.post(`${baseURL}/api/auth/register`, {
      email: 'phat_test@shopai.com',
      password: 'password123',
      name: 'Nguyễn Phát',
    }).catch(e => null);

    if (regRes && regRes.data) {
      token = regRes.data.accessToken;
      console.log('Registered user successfully!');
    } else {
      const loginRes = await axios.post(`${baseURL}/api/auth/login`, {
        email: 'phat_test@shopai.com',
        password: 'password123',
      });
      token = loginRes.data.accessToken;
      console.log('Logged in existing user successfully!');
    }

    console.log('Token acquired:', token.slice(0, 20) + '...');

    const orderRes = await axios.post(
      `${baseURL}/api/orders`,
      {
        items: [
          { productId: 'prod_1', quantity: 1 },
          { productId: 'prod_2', quantity: 2 },
        ],
        total: 90000000,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log('✅ Order created in Database successfully:');
    console.log(JSON.stringify(orderRes.data, null, 2));

    const myOrders = await axios.get(`${baseURL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ User has ${myOrders.data.length} orders in Database.`);
  } catch (err) {
    console.error('❌ Error testing backend order:', err.response?.data || err.message);
  }
}

testBackendOrder();
