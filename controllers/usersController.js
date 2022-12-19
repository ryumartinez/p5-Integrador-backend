// @ts-nocheck
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient
const User = prisma.user

//**listar todos los usuarios */

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findMany();
//me fijo si users tiene algun elemento
  if (!users?.length) {
    return res.status(400).json({ message: "No se encontraron usuarios" });
  }

  res.json(users);
});

//**crear un nuevo usuario */

const createNewUser = asyncHandler(async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const roles = req.body.roles;

  // Confirmo la data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  // Me fijo si el usuario ya existe
  const duplicate = await User.findFirst({ where: { username: username } });
  if (duplicate) {
    return res.status(409).json({ message: "Este usuario ya existe" });
  }

  // Hasheo
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  // Guardo mi user en la db
  const user = await User.create({
    data: { username, password: hashedPwd },
  });

  if (user) {
    
    res.status(201).json({ message: `Nuevo usuario ${username} creado` });
  } else {
    res.status(400).json({ message: "No se pudo crear el usuario" });
  }
});

//**eliminar un usuario con cierto id */

const deleteUser = asyncHandler(async (req, res) => {
  const id = Number(req.body.id);

    // Confirmo la data

  if (!id) {
    return res.status(400).json({ message: "Falta el user id" });
  }

  // Me fijo si el usuario existe
  const user = await User.findUnique({ where: { id } });

  if (!user) {
    return res.status(400).json({ message: "Usuario no encontrado" });
  }

  const result = await User.delete({ where: { id } });

  const reply = `Usuario ${result.username} con id ${result.id} eliminado`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  deleteUser,
};
