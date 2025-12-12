import bcrypt from 'bcryptjs';
const hash = '$2a$10$pRXpEp...'; // placeholder
console.log('compare result:', bcrypt.compareSync('admin123', hash));
