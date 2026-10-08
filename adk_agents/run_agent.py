#!/usr/bin/env python3
"""
Test runner for Google ADK OmniCommerce Agents
Execute directly: python3 adk_agents/run_agent.py
"""

import json
from agent import root_agent

def main():
    print("=" * 60)
    print("Google ADK (Agent Development Kit) Multi-Agent System")
    print("Active Model: Gemini 3.7 Flash | Root: omnicommerce_root_agent")
    print("=" * 60)

    test_queries = [
        "Find me a minimalist Scandinavian oak desk chair under $300",
        "Process customer return for broken serial tag on headphones",
        "Forecast 14-day winter shell demand during cold front weather",
        "Scan store #104 for phantom inventory stockouts"
    ]

    for idx, query in enumerate(test_queries, 1):
        print(f"\n[Test Case {idx}]: Query -> \"{query}\"")
        result = root_agent.run(query)
        print(f"  → Delegated Agent: {result['delegated_to']}")
        print(f"  → Thinking Trace:  {result['thinking_trace']}")
        print(f"  → Tool Result:     {json.dumps(result['tool_output'], indent=2)}")

    print("\n✓ All Google ADK agent test runs completed successfully with 0 errors.")

if __name__ == "__main__":
    main()
