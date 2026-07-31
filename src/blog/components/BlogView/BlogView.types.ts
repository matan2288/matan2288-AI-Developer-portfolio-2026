export interface BlogViewProps {
  onBackToPortfolio: () => void;
  selectedPostId?: string | null;
  onSelectPost?: (id: string | null) => void;
}
