/** Command tier with the original roles and permissions. */
export interface CommandTier {
  title: string;
  ranks: { name: string; permission: string }[];
}
