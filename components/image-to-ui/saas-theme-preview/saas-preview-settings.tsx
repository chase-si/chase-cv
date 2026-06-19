"use client";

import { useTranslations } from "next-intl";

import { SETTINGS_TEAM_MEMBERS } from "@/components/image-to-ui/saas-theme-preview/preview-demo-data";
import { PreviewSelectContent } from "@/components/image-to-ui/preview-theme-scope";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";

export function SaasPreviewSettings() {
  const t = useTranslations("imageToUi.preview");

  return (
    <div
      className="flex flex-col gap-4 bg-background pt-4"
      data-testid="saas-settings-form"
      aria-label={t("settingsAria")}
    >
      <Card size="sm" data-testid="saas-settings-upgrade" className="shadow-sm">
        <CardHeader>
          <CardTitle>{t("upgradeTitle")}</CardTitle>
          <CardDescription>
            {t("upgradeDescription")}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="outline">
            {t("cancel")}
          </Button>
          <Button type="button">{t("upgradePlan")}</Button>
        </CardFooter>
      </Card>

      <Card size="sm" data-testid="saas-settings-team" className="shadow-sm">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Invite your team members to collaborate.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {SETTINGS_TEAM_MEMBERS.map((member) => (
            <div key={member.email} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar size="sm">
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <Badge variant="secondary">{member.role}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card size="sm" data-testid="saas-settings-create-account" className="shadow-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your email below to create your account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="button" variant="outline">
              GitHub
            </Button>
            <Button type="button" variant="outline">
              Google
            </Button>
          </div>
          <div className="relative flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">Or continue with</span>
            <Separator className="flex-1" />
          </div>
          <div className="grid gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="preview-account-email">Email</Label>
              <Input id="preview-account-email" type="email" placeholder="m@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="preview-account-password">Password</Label>
              <Input id="preview-account-password" type="password" />
            </div>
          </div>
          <Button type="button" className="w-full sm:w-auto">
            Create account
          </Button>
        </CardContent>
      </Card>

      <Card size="sm" className="shadow-sm">
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Name, plan, and operational defaults.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input id="workspace-name" defaultValue="Atlas Control Room" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="workspace-plan">Plan</Label>
              <Select defaultValue="scale">
                <SelectTrigger id="workspace-plan" aria-label="Plan" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <PreviewSelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </PreviewSelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="autoscale-threshold">{t("autoScale")}</Label>
            <Slider aria-label={t("autoScale")} id="autoscale-threshold" min={20} max={95} defaultValue={[65]} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Toggle type="button" variant="outline" defaultPressed>
              Enable maintenance mode
            </Toggle>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox defaultChecked aria-label={t("notifySms")} />
              <span>{t("notifySms")}</span>
            </label>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="secondary">
            Reset
          </Button>
          <Button type="button">{t("saveChanges")}</Button>
        </CardFooter>
      </Card>

      <Card size="sm" data-testid="saas-settings-cookies" className="shadow-sm">
        <CardHeader>
          <CardTitle>Cookie Settings</CardTitle>
          <CardDescription>Manage your cookie settings here.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Strictly Necessary</p>
              <p className="text-xs text-muted-foreground">
                These cookies are essential in order to use the website and its features.
              </p>
            </div>
            <Switch defaultChecked aria-label="Strictly necessary cookies" />
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Functional Cookies</p>
              <p className="text-xs text-muted-foreground">
                These cookies allow the website to provide personalized functionality.
              </p>
            </div>
            <Switch aria-label="Functional cookies" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button" size="sm">
            Save preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
