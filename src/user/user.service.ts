import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(login: string, password: string): Promise<User> {
    const now = BigInt(Date.now());

    const user = await this.prisma.user.create({
      data: {
        login,
        password,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
    });

    return this.mapPrismaUserToUser(user);
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapPrismaUserToUser(user) : null;
  }

  async getUserByLogin(login: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    return user ? this.mapPrismaUserToUser(user) : null;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.mapPrismaUserToUser(user));
  }

  async updateUser(
    id: string,
    updates: Partial<Omit<User, 'id' | 'createdAt'>>,
  ): Promise<User | null> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return null;
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...updates,
          version: existingUser.version + 1,
          updatedAt: BigInt(Date.now()),
        },
      });

      return this.mapPrismaUserToUser(user);
    } catch (error) {
      return null;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapPrismaUserToUser(prismaUser: any): User {
    return {
      id: prismaUser.id,
      login: prismaUser.login,
      password: prismaUser.password,
      version: prismaUser.version,
      createdAt: Number(prismaUser.createdAt),
      updatedAt: Number(prismaUser.updatedAt),
    };
  }
}
