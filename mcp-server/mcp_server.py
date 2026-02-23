import asyncio
import os
from mcp.server.models import InitializationOptions
from mcp.server import Server
from mcp.server.stdio import stdio_server
import mcp.types as types
from database import add_expense, get_expenses, get_summary, update_expense, delete_expense

server = Server("expense-tracker")

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """List available tools."""
    return [
        types.Tool(
            name="add_expense",
            description="Add a new expense entry for a user",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The unique UUID of the user"},
                    "amount": {"type": "number", "description": "The amount spent (in Rupees)"},
                    "category": {"type": "string", "description": "Category (e.g., food, travel, veg, etc.)"},
                    "description": {"type": "string", "description": "Brief description of the expense"},
                    "raw_query": {"type": "string", "description": "The original text query from user"}
                },
                "required": ["user_id", "amount", "category"]
            },
        ),
        types.Tool(
            name="get_expenses",
            description="Get recent expenses for a user",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The unique UUID of the user"},
                    "limit": {"type": "number", "description": "Number of expenses to fetch", "default": 10}
                },
                "required": ["user_id"]
            },
        ),
        types.Tool(
            name="get_summary",
            description="Get a summary of total expenses for a user",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The unique UUID of the user"},
                    "period": {"type": "string", "enum": ["today", "month", "year", "total"]},
                    "category": {"type": "string"}
                },
                "required": ["user_id"]
            },
        ),
        types.Tool(
            name="update_expense",
            description="Update an existing expense by description match",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string"},
                    "description": {"type": "string", "description": "Description to find the record"},
                    "amount": {"type": "number", "description": "New amount"}
                },
                "required": ["user_id", "description", "amount"]
            },
        ),
        types.Tool(
            name="delete_expense",
            description="Delete an expense record",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string"},
                    "description": {"type": "string", "description": "Match description"},
                    "category": {"type": "string", "description": "Match category"}
                },
                "required": ["user_id"]
            },
        )
    ]

@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict | None
) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
    """Handle tool execution requests."""
    if not arguments:
        raise ValueError("Missing arguments")

    if name == "add_expense":
        result = add_expense(**arguments)
        return [types.TextContent(type="text", text=f"Success! Added expense: {result}")]

    elif name == "get_expenses":
        result = get_expenses(**arguments)
        return [types.TextContent(type="text", text=str(result))]

    elif name == "get_summary":
        result = get_summary(**arguments)
        return [types.TextContent(type="text", text=f"Summary: {result}")]

    elif name == "update_expense":
        result = update_expense(**arguments)
        return [types.TextContent(type="text", text=f"Update Result: {result}")]

    elif name == "delete_expense":
        result = delete_expense(**arguments)
        return [types.TextContent(type="text", text=f"Delete Result: {result}")]

    else:
        raise ValueError(f"Unknown tool: {name}")

async def main():
    import sys
    import json

    # Check if called via CLI for a specific tool (used by our Node.js bridge)
    if len(sys.argv) > 1:
        tool_name = sys.argv[1]
        arguments = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
        
        # Simple dispatcher for CLI use
        if tool_name == "add_expense":
            result = add_expense(**arguments)
            print(json.dumps(result))
        elif tool_name == "get_expenses":
            result = get_expenses(**arguments)
            print(json.dumps(result))
        elif tool_name == "get_summary":
            result = get_summary(**arguments)
            print(json.dumps(result))
        elif tool_name == "update_expense":
            result = update_expense(**arguments)
            print(json.dumps(result))
        elif tool_name == "delete_expense":
            result = delete_expense(**arguments)
            print(json.dumps(result))
        else:
            print(json.dumps({"error": f"Unknown tool: {tool_name}"}))
        return

    # Run the server using stdin/stdout streams (Standard MCP)
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="expense-tracker",
                server_version="0.1.0",
                capabilities=server.get_capabilities(
                    notification_options=types.NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )

if __name__ == "__main__":
    asyncio.run(main())
