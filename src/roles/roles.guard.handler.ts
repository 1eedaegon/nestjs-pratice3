import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export class HandlerRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = 'user-id' || request.user; // JWT에서 검증 후 얻은 user-id sample.
    const userRole = this.getUserRole(userId);

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    return roles?.includes(userRole) ?? true;
  }
  private getUserRole(userId: string): string {
    return 'admin'; // JWT에서 넘어온 userid가 admin이라고 가정.
  }
}
