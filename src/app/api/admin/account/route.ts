import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// GET /api/admin/account - Obtener información del administrador (sin contraseña)
export async function GET() {
  try {
    // Verificar que el usuario está autenticado
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error al obtener información del administrador:', error);
    return NextResponse.json(
      { error: 'Error al obtener información del administrador' },
      { status: 500 }
    );
  }
}

// POST /api/admin/account - Actualizar email o contraseña del administrador
export async function POST(request: Request) {
  try {
    // Verificar que el usuario está autenticado
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const { email, currentPassword, newPassword } = await request.json();
    
    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    // Si se proporcionó una contraseña, verificar que sea correcta
    if (currentPassword || newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Debe proporcionar la contraseña actual' },
          { status: 400 }
        );
      }
      
      // Verificar la contraseña actual
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!passwordMatch) {
        return NextResponse.json(
          { error: 'La contraseña actual es incorrecta' },
          { status: 400 }
        );
      }
      
      // Si se proporcionó una nueva contraseña, actualizarla
      if (newPassword) {
        if (newPassword.length < 8) {
          return NextResponse.json(
            { error: 'La nueva contraseña debe tener al menos 8 caracteres' },
            { status: 400 }
          );
        }
        
        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Actualizar el usuario
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });
      }
    }
    
    // Si se proporcionó un nuevo email, actualizarlo
    if (email && email !== user.email) {
      // Verificar que el email tenga un formato válido
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'El formato del email no es válido' },
          { status: 400 }
        );
      }
      
      // Verificar que el email no esté en uso
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json(
          { error: 'El email ya está en uso por otro usuario' },
          { status: 400 }
        );
      }
      
      // Actualizar el usuario
      await prisma.user.update({
        where: { id: user.id },
        data: { email }
      });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Información de cuenta actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar información del administrador:', error);
    return NextResponse.json(
      { error: 'Error al actualizar información del administrador' },
      { status: 500 }
    );
  }
} 