"use client";

import { useEffect } from "react";

import { absoluteUrlClient } from "@/lib/seo/urls-client";

type ModelContext = {
  registerTool: (tool: {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    execute: (input: Record<string, unknown>) => Promise<unknown>;
  }) => void;
};

export function AgentWebMcpTools() {
  useEffect(() => {
    const navigatorWithModel = navigator as Navigator & {
      modelContext?: ModelContext;
    };
    const modelContext = navigatorWithModel.modelContext;
    if (!modelContext?.registerTool) return;

    const saleBase = absoluteUrlClient("/properties-for-sale");
    const rentBase = absoluteUrlClient("/properties-for-rent");
    const agentBase = absoluteUrlClient("/find-agent");

    modelContext.registerTool({
      name: "search_properties",
      description:
        "Search Property Team for property for sale or rent in Kenya. Returns a URL to filtered listings.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Free-text search" },
          listingType: {
            type: "string",
            enum: ["sale", "rent"],
            description: "Sale or rent listings",
          },
        },
        required: ["query"],
      },
      execute: async (input) => {
        const query = String(input.query ?? "").trim();
        const listingType = input.listingType === "rent" ? "rent" : "sale";
        const base = listingType === "rent" ? rentBase : saleBase;
        const url = query
          ? `${base}?search=${encodeURIComponent(query)}`
          : base;
        return { ok: true, url };
      },
    });

    modelContext.registerTool({
      name: "list_agencies",
      description: "Open the Property Team directory of approved real estate agencies in Kenya.",
      inputSchema: {
        type: "object",
        properties: {
          town: { type: "string", description: "Optional town filter" },
        },
      },
      execute: async (input) => {
        const town = String(input.town ?? "").trim();
        const url = town
          ? `${agentBase}?town=${encodeURIComponent(town)}`
          : agentBase;
        return { ok: true, url };
      },
    });
  }, []);

  return null;
}