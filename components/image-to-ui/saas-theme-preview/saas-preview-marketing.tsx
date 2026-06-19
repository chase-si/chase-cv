"use client";

import { ArrowUpRight, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

import { LANDING_FEATURE_CARDS } from "@/components/image-to-ui/saas-theme-preview/preview-demo-data";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export function SaasPreviewMarketing() {
  const t = useTranslations("imageToUi.preview");

  return (
    <section
      data-testid="landing-page-preview"
      className="flex flex-col gap-4 bg-background pt-4"
      aria-label={t("landingAria")}
    >
      <Card size="sm" className="shadow-sm">
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2" data-testid="landing-nav">
            <div className="flex size-8 items-center justify-center bg-primary text-sm font-semibold text-primary-foreground">
              A
            </div>
            <span className="text-sm font-semibold text-foreground">Atlas</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Platform</span>
            <span>Customers</span>
            <span>Pricing</span>
          </div>
          <Button type="button" size="sm">
            Book demo
          </Button>
        </CardContent>
      </Card>

      <div
        data-testid="landing-hero"
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]"
      >
        <Card size="sm" className="shadow-sm">
          <CardContent className="flex min-w-0 flex-col justify-center gap-5 py-4">
            <Badge variant="accent">{t("landingEyebrow")}</Badge>
            <div className="max-w-2xl">
              <h3 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {t("landingHeadline")}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                {t("landingDescription")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" data-testid="landing-primary-cta">
                {t("startTrial")}
              </Button>
              <Button type="button" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                {t("watchDemo")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card size="sm" data-testid="landing-hero-panel" className="shadow-sm" aria-label="Marketing dashboard preview card">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm">Launch readiness</CardTitle>
                <CardDescription>Q3 activation target</CardDescription>
              </div>
              <Badge variant="secondary">74%</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Progress value={74}>
              <ProgressLabel>Launch readiness</ProgressLabel>
              <ProgressValue />
            </Progress>
            <Separator />
            <div className="grid gap-2">
              {["Executive brief", "Lifecycle playbook", "Renewal motion"].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between gap-3 border border-border px-2 py-2"
                >
                  <span className="text-sm text-foreground">{item}</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {LANDING_FEATURE_CARDS.map((feature) => (
          <Card key={feature.title} size="sm" data-testid="landing-feature-card" className="min-h-36 shadow-sm">
            <CardHeader>
              <div className="flex size-9 items-center justify-center bg-secondary text-secondary-foreground">
                <Zap className="size-4" aria-hidden />
              </div>
              <CardTitle className="text-sm">{feature.title}</CardTitle>
              <CardDescription className="text-xs leading-5">{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
        <Card size="sm" data-testid="landing-social-proof" className="shadow-sm">
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">Trusted by growth teams</p>
              <p className="text-xs text-muted-foreground">
                2,400+ workspaces coordinate renewals and expansion launches here.
              </p>
            </div>
            <AvatarGroup>
              <Avatar size="sm">
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+8</AvatarGroupCount>
            </AvatarGroup>
          </CardContent>
        </Card>

        <Card size="sm" data-testid="landing-conversion-strip" className="shadow-sm">
          <CardContent className="flex flex-col justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Ready to operationalize?</p>
              <p className="text-xs text-muted-foreground">Invite the team and ship a branded workspace.</p>
            </div>
            <Button type="button" size="sm">
              <ArrowUpRight data-icon="inline-start" aria-hidden />
              Upgrade workspace
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
