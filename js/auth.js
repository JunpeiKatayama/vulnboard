/* Authentication Logic - Intentionally Vulnerable */

const Auth = {
    // Register new user
    register: function(username, password, email) {
        if (Store.findUser(username)) {
            return { success: false, message: 'ユーザー名は既に使用されています。' };
        }

        const newUser = {
            userId: Utils.generateId(),
            username: username,
            password: password, // VULNERABILITY: Plain text password
            email: email,
            isAdmin: false, // Default to false
            createdAt: Date.now()
        };

        Store.saveUser(newUser);
        return { success: true, message: '登録が完了しました。ログインしてください。' };
    },

    // Login
    login: function(username, password) {
        const user = Store.findUser(username);
        
        // VULNERABILITY: Plain text password comparison
        if (user && user.password === password) {
            this.createSession(user);
            return { success: true };
        }
        return { success: false, message: 'ユーザー名またはパスワードが間違っています。' };
    },

    // Create session (client-side only)
    createSession: function(user) {
        const session = {
            userId: user.userId,
            username: user.username,
            isAdmin: user.isAdmin,
            loginTime: Date.now()
        };
        // VULNERABILITY: Session contains full user info and trusting client
        localStorage.setItem(Store.KEYS.SESSION, JSON.stringify(session));
    },

    // Get current user session
    getCurrentUser: function() {
        const session = localStorage.getItem(Store.KEYS.SESSION);
        return session ? JSON.parse(session) : null;
    },

    // Logout
    logout: function() {
        localStorage.removeItem(Store.KEYS.SESSION);
        window.location.href = 'index.html';
    },

    // Check if user is admin
    // VULNERABILITY: Client-side check only
    isAdmin: function() {
        const user = this.getCurrentUser();
        return user && user.isAdmin === true;
    },

    // Require login (redirect if not logged in)
    requireLogin: function() {
        if (!this.getCurrentUser()) {
            window.location.href = 'login.html';
        }
    }
};
