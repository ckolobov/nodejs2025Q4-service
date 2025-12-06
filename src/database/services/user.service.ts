import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../interfaces';

@Injectable()
export class UserService {
  private users: Map<string, User> = new Map();

  createUser(login: string, password: string): User {
    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      login,
      password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    return user;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByLogin(login: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.login === login);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(
    id: string,
    updates: Partial<Omit<User, 'id' | 'createdAt'>>,
  ): User | undefined {
    const user = this.users.get(id);
    if (!user) {
      return undefined;
    }

    const updatedUser: User = {
      ...user,
      ...updates,
      id: user.id, // Ensure id cannot be changed
      createdAt: user.createdAt, // Ensure createdAt cannot be changed
      version: user.version + 1,
      updatedAt: Date.now(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }
}
