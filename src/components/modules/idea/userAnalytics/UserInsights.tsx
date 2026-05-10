import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info, Lightbulb, TrendingDown, TrendingUp } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface Insight {
  icon: LucideIcon;
  text: string;
  iconColor: string;
  bg: string;
}

function buildInsights(
  totalideas: number,
  approvedideas: number,
  totalVotes: number,
  upVotes: number,
): Insight[] {
  const insights: Insight[] = [];
  const approvalRate = totalideas > 0 ? (approvedideas / totalideas) * 100 : 0;
  const upVotePct = totalVotes > 0 ? (upVotes / totalVotes) * 100 : 0;

  if (totalideas === 0) {
    insights.push({
      icon: Lightbulb,
      text: "Create your first event to see analytics here!",
      iconColor: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    });
    return insights;
  }

  if (approvalRate >= 70) {
    insights.push({
      icon: TrendingUp,
      text: `Your event launch rate is ${approvalRate.toFixed(0)}% — fantastic!`,
      iconColor: "text-zinc-500",
      bg: "bg-zinc-50 dark:bg-zinc-950/30",
    });
  } else if (approvalRate >= 40) {
    insights.push({
      icon: Info,
      text: `Your launch rate is ${approvalRate.toFixed(0)}% — keep improving your events.`,
      iconColor: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    });
  } else {
    insights.push({
      icon: TrendingDown,
      text: `Launch rate is ${approvalRate.toFixed(0)}% — focus on event quality.`,
      iconColor: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/30",
    });
  }

  if (totalVotes === 0) {
    insights.push({
      icon: Lightbulb,
      text: "Publish your events to get attendee feedback!",
      iconColor: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    });
  } else if (upVotePct >= 80) {
    insights.push({
      icon: TrendingUp,
      text: `${upVotePct.toFixed(0)}% positive feedback — attendees love your events!`,
      iconColor: "text-zinc-500",
      bg: "bg-zinc-50 dark:bg-zinc-950/30",
    });
  } else if (totalVotes >= 10) {
    insights.push({
      icon: TrendingUp,
      text: "You have strong engagement from attendees!",
      iconColor: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    });
  }

  const rejected = totalideas - approvedideas;
  if (rejected > 0 && approvedideas > 0) {
    insights.push({
      icon: Info,
      text: `${rejected} event${rejected > 1 ? "s" : ""} in draft — review and publish to go live.`,
      iconColor: "text-muted-foreground",
      bg: "bg-muted/50",
    });
  }

  return insights;
}

interface UserInsightsProps {
  totalideas: number;
  approvedideas: number;
  totalVotes: number;
  upVotes: number;
  animationDelay?: string;
}

export function UserInsights({
  totalideas,
  approvedideas,
  totalVotes,
  upVotes,
  animationDelay = "",
}: UserInsightsProps) {
  const insights = buildInsights(
    totalideas,
    approvedideas,
    totalVotes,
    upVotes,
  );

  return (
    <div className={`animate-eco-fade-up ${animationDelay}`}>
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Smart Insights</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-5">
          {insights.map((insight, i) => {
            const Icon = insight.icon;
            return (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 rounded-xl p-4",
                  insight.bg,
                )}
              >
                <Icon
                  className={cn("mt-0.5 h-4 w-4 shrink-0", insight.iconColor)}
                />
                <p className="text-sm leading-relaxed">{insight.text}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
