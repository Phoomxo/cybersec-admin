const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());

const port = 3000;

// ดึงข้อมูลผู้ใช้งานทั้งหมด
app.get('/user', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        
        const sanitizedUsers = users.map(user => ({
            id: user.id,
            username: user.username
        }));

        res.json({ message: 'ดึงข้อมูลสำเร็จ', data: sanitizedUsers });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});



app.post('/user', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = await prisma.user.create({
            data: { username, password }
        });
        res.status(201).json({ message: 'เพิ่มข้อมูลสำเร็จ', data: newUser });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});


app.put('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { username, password }
        });
        res.json({ message: 'แก้ไขข้อมูลสำเร็จ', data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});

app.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'ลบข้อมูลสำเร็จ' });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/user`);
});
