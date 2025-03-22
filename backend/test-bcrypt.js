const bcrypt = require('bcrypt');

(async () => {
    try {
        const hash = await bcrypt.hash('testpassword', 10);
        console.log('Hash generado:', hash);
    } catch (error) {
        console.error('Error con bcrypt:', error);
    }
})();
