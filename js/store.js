/* Data Store for VulnBoard - Intentionally Vulnerable */

const Store = {
    KEYS: {
        USERS: 'vulnboard_users',
        THREADS: 'vulnboard_threads',
        SESSION: 'vulnboard_session'
    },

    // --- Users ---
    getUsers: function() {
        const users = localStorage.getItem(this.KEYS.USERS);
        return users ? JSON.parse(users) : [];
    },

    saveUser: function(user) {
        const users = this.getUsers();
        // VULNERABILITY: Storing password in plain text
        users.push(user);
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    },

    findUser: function(username) {
        const users = this.getUsers();
        return users.find(u => u.username === username);
    },

    updateUser: function(updatedUser) {
        let users = this.getUsers();
        users = users.map(u => u.userId === updatedUser.userId ? updatedUser : u);
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    },

    // --- Threads ---
    getThreads: function() {
        const threads = localStorage.getItem(this.KEYS.THREADS);
        return threads ? JSON.parse(threads) : [];
    },

    saveThread: function(thread) {
        const threads = this.getThreads();
        threads.unshift(thread); // Newest first
        localStorage.setItem(this.KEYS.THREADS, JSON.stringify(threads));
    },

    getThread: function(threadId) {
        const threads = this.getThreads();
        return threads.find(t => t.threadId === threadId);
    },

    addReply: function(threadId, reply) {
        let threads = this.getThreads();
        const threadIndex = threads.findIndex(t => t.threadId === threadId);
        if (threadIndex !== -1) {
            if (!threads[threadIndex].replies) {
                threads[threadIndex].replies = [];
            }
            threads[threadIndex].replies.push(reply);
            localStorage.setItem(this.KEYS.THREADS, JSON.stringify(threads));
        }
    },

    // VULNERABILITY: No ownership check on delete in the store layer
    deleteThread: function(threadId) {
        let threads = this.getThreads();
        threads = threads.filter(t => t.threadId !== threadId);
        localStorage.setItem(this.KEYS.THREADS, JSON.stringify(threads));
    }
};
