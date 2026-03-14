interface ToolInvocation {
  toolName: string;
  args: Record<string, unknown>;
}

export function getToolLabel(tool: ToolInvocation): string {
  const { toolName, args } = tool;
  const command = args?.command as string | undefined;
  const path = args?.path as string | undefined;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return path ? `Creating ${path}` : "Creating file";
      case "str_replace":
      case "insert":
        return path ? `Editing ${path}` : "Editing file";
      case "view":
        return path ? `Reading ${path}` : "Reading file";
      case "undo_edit":
        return path ? `Undoing edit ${path}` : "Undoing edit";
      default:
        return toolName;
    }
  }

  if (toolName === "file_manager") {
    const newPath = args?.new_path as string | undefined;
    switch (command) {
      case "rename":
        return path && newPath
          ? `Renaming ${path} → ${newPath}`
          : "Renaming file";
      case "delete":
        return path ? `Deleting ${path}` : "Deleting file";
      default:
        return toolName;
    }
  }

  return toolName;
}

export function ToolCallLabel({ toolInvocation }: { toolInvocation: ToolInvocation }) {
  return <span className="text-gray-300">{getToolLabel(toolInvocation)}</span>;
}
