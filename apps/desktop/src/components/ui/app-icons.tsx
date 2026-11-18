import React from "react";
import {
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Search,
  List,
  BookOpen,
  BookType,
  Stethoscope,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  History,
  Eye,
  Columns,
  MessageSquare,
  Highlighter,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronDown,
  X,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Share2,
  Terminal,
  Code,
  HelpCircle,
  ShieldCheck,
  WifiOff,
  Sliders,
  Type,
  Bold,
  Italic,
  AlignLeft,
  Table,
  Image,
  Link,
  Hash,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/**
 * Standardized icon stroke and optical sizing helper.
 * Enforces a cohesive 1.5 - 1.75px stroke language across the application.
 */
export function createStudioIcon(Icon: LucideIcon) {
  return function StudioIcon({
    className = "size-4",
    strokeWidth = 1.75,
    ...props
  }: LucideProps) {
    return <Icon className={className} strokeWidth={strokeWidth} {...props} />;
  };
}

// Studio Icon Map
export const Icons = {
  // Navigation & File operations
  Files: createStudioIcon(Folder),
  FolderOpen: createStudioIcon(FolderOpen),
  FolderPlus: createStudioIcon(FolderPlus),
  FileTex: createStudioIcon(FileText),
  Search: createStudioIcon(Search),
  Outline: createStudioIcon(List),
  References: createStudioIcon(BookOpen),
  Grammar: createStudioIcon(BookType),
  Health: createStudioIcon(Stethoscope),
  Settings: createStudioIcon(Settings),
  History: createStudioIcon(History),
  Help: createStudioIcon(HelpCircle),

  // Document & Preview actions
  Compile: createStudioIcon(RefreshCw),
  Download: createStudioIcon(Download),
  Upload: createStudioIcon(Upload),
  Export: createStudioIcon(Share2),
  Preview: createStudioIcon(Eye),
  SplitView: createStudioIcon(Columns),
  ReaderMode: createStudioIcon(BookOpen),
  Fullscreen: createStudioIcon(Maximize2),
  ExitFullscreen: createStudioIcon(Minimize2),

  // Review & Collaboration
  Comments: createStudioIcon(MessageSquare),
  Highlight: createStudioIcon(Highlighter),

  // Assistant & Intelligence
  Ai: createStudioIcon(Sparkles),
  Terminal: createStudioIcon(Terminal),
  Code: createStudioIcon(Code),

  // Semantic Status
  Success: createStudioIcon(CheckCircle2),
  Error: createStudioIcon(AlertCircle),
  Warning: createStudioIcon(AlertTriangle),
  Shield: createStudioIcon(ShieldCheck),
  Offline: createStudioIcon(WifiOff),

  // Formatting & Editing
  Type: createStudioIcon(Type),
  Bold: createStudioIcon(Bold),
  Italic: createStudioIcon(Italic),
  Align: createStudioIcon(AlignLeft),
  Table: createStudioIcon(Table),
  Image: createStudioIcon(Image),
  Link: createStudioIcon(Link),
  Section: createStudioIcon(Hash),
  Sliders: createStudioIcon(Sliders),

  // UI Micro-interactions
  Close: createStudioIcon(X),
  Add: createStudioIcon(Plus),
  Delete: createStudioIcon(Trash2),
  Edit: createStudioIcon(Edit2),
  ChevronRight: createStudioIcon(ChevronRight),
  ChevronDown: createStudioIcon(ChevronDown),
  External: createStudioIcon(ExternalLink),
};
