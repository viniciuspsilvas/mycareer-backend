const { UserRole } = require("@prisma/client");

module.exports = [
    {
        firstname: 'Vinicius',
        lastname: 'Silva',
        email: 'viniciuspsilvas@gmail.com',
        password: '$2a$12$Uh940/y1XVEq4s3r9QCn8.XibUcqgiW3I0pIs1xDNsY23FVgd60/.',
        createdAt: new Date(),
        role: UserRole.ADMIN,
        tokenVersion: 0
    },
    {
        firstname: 'Joao',
        lastname: 'User',
        email: 'user1@gmail.com',
        password: '$2a$12$Uh940/y1XVEq4s3r9QCn8.XibUcqgiW3I0pIs1xDNsY23FVgd60/.',
        createdAt: new Date(),
        role: UserRole.USER,
        tokenVersion: 0
    }
]
