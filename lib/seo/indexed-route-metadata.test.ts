import { describe, expect, it } from "vitest";

import { getIndexedSeoRoutes } from "@/lib/seo/route-registry";

import { listIndexedRouteMetadataBindings } from "./indexed-route-metadata";

describe("indexed route metadata catalog", () => {
  it("binds every indexed route to a namespace and social preview asset", () => {
    const bindings = listIndexedRouteMetadataBindings();
    const routes = getIndexedSeoRoutes();

    expect(bindings.map((item) => item.pathname)).toEqual(
      routes.map((route) => route.pathname),
    );

    for (const binding of bindings) {
      expect(binding.namespace.length).toBeGreaterThan(0);
      expect(binding.socialImage.path.startsWith("/og/")).toBe(true);
      expect(binding.socialImage.width).toBe(1200);
      expect(binding.socialImage.height).toBe(630);
    }
  });
});
