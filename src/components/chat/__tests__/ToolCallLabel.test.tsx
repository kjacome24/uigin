import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallLabel } from "../ToolCallLabel";

afterEach(() => {
  cleanup();
});

test("shows 'Creating /path' for str_replace_editor create", () => {
  render(
    <ToolCallLabel
      toolInvocation={{ toolName: "str_replace_editor", args: { command: "create", path: "/App.jsx" } }}
    />
  );
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("shows 'Editing /path' for str_replace_editor str_replace", () => {
  render(
    <ToolCallLabel
      toolInvocation={{ toolName: "str_replace_editor", args: { command: "str_replace", path: "/App.jsx" } }}
    />
  );
  expect(screen.getByText("Editing /App.jsx")).toBeDefined();
});

test("shows 'Editing /path' for str_replace_editor insert", () => {
  render(
    <ToolCallLabel
      toolInvocation={{ toolName: "str_replace_editor", args: { command: "insert", path: "/components/Card.jsx" } }}
    />
  );
  expect(screen.getByText("Editing /components/Card.jsx")).toBeDefined();
});

test("shows 'Reading /path' for str_replace_editor view", () => {
  render(
    <ToolCallLabel
      toolInvocation={{ toolName: "str_replace_editor", args: { command: "view", path: "/App.jsx" } }}
    />
  );
  expect(screen.getByText("Reading /App.jsx")).toBeDefined();
});

test("shows 'Undoing edit /path' for str_replace_editor undo_edit", () => {
  render(
    <ToolCallLabel
      toolInvocation={{ toolName: "str_replace_editor", args: { command: "undo_edit", path: "/App.jsx" } }}
    />
  );
  expect(screen.getByText("Undoing edit /App.jsx")).toBeDefined();
});

test("shows 'Renaming /old → /new' for file_manager rename", () => {
  render(
    <ToolCallLabel
      toolInvocation={{ toolName: "file_manager", args: { command: "rename", path: "/old.jsx", new_path: "/new.jsx" } }}
    />
  );
  expect(screen.getByText("Renaming /old.jsx → /new.jsx")).toBeDefined();
});

test("shows 'Deleting /path' for file_manager delete", () => {
  render(
    <ToolCallLabel
      toolInvocation={{ toolName: "file_manager", args: { command: "delete", path: "/App.jsx" } }}
    />
  );
  expect(screen.getByText("Deleting /App.jsx")).toBeDefined();
});

test("falls back to toolName for unknown tool", () => {
  render(
    <ToolCallLabel
      toolInvocation={{ toolName: "some_unknown_tool", args: {} }}
    />
  );
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});

test("falls back to toolName for unknown command", () => {
  render(
    <ToolCallLabel
      toolInvocation={{ toolName: "str_replace_editor", args: { command: "unknown_cmd" } }}
    />
  );
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});
