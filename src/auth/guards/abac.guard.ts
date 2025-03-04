import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessPoliciesService } from 'src/access-policies/access-policies.service';
import { AbacAttributes } from '../types/abac-attributes'; // Import the interface

@Injectable()
export class AbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessPoliciesService: AccessPoliciesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const route = request.route.path; // e.g., "/appointments"
    const method = request.method; // e.g., "GET"

    // Fetch all policies
    const policies = await this.accessPoliciesService.getAllAccessPolicies();

    // Filter policies applicable to this route and method
    const applicablePolicies = policies.filter(
      (policy) =>
        policy.resources.includes(route) && policy.actions.includes(method),
    );

    if (!applicablePolicies.length) return true; // No policies, allow access

    // Current attributes from request/context
    const currentTime = new Date().toISOString().substring(11, 16); // e.g., "14:30"
    const userLocation = request.headers['x-location'] || 'unknown'; // Custom header

    for (const policy of applicablePolicies) {
      const attributes = policy.attributes as AbacAttributes; // Type assertion
      let isMatch = true;

      // Time-based check
      if (attributes.time) {
        const { gte, lte } = attributes.time;
        if (gte && currentTime < gte) isMatch = false;
        if (lte && currentTime > lte) isMatch = false;
      }

      // Location-based check
      if (attributes.location && attributes.location !== userLocation) {
        isMatch = false;
      }

      // Add more attribute checks as needed (e.g., custom attributes)

      if (isMatch) {
        return policy.effect === 'ALLOW';
      }
    }

    return false; // Deny if no policy matches
  }
}