export const authService = {
  login: async (email, password) => {
    // Giả lập độ trễ mạng 500ms
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!email.includes('@') || password.length < 6) {
      throw new Error('Email hoặc mật khẩu không đúng!');
    }
    const user = { id: 1, name: email.split('@')[0], email };
    // Token chứa user + thời hạn 24 giờ (86400000 ms)
    const token = btoa(JSON.stringify({ ...user, exp: Date.now() + 86400000 }));
    return { user, token };
  },

  getUser: (token) => {
    try {
      return JSON.parse(atob(token));
    } catch {
      return null;
    }
  },
};