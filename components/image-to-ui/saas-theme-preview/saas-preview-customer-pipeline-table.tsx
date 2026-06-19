"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { PREVIEW_CUSTOMER_PIPELINE_ROWS } from "@/components/image-to-ui/saas-theme-preview/preview-demo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SaasPreviewCustomerPipelineTable() {
  const t = useTranslations("imageToUi.preview");

  return (
    <Card
      size="sm"
      data-testid="saas-data-table-section"
      className="shadow-sm"
      aria-label={t("tableSectionAria")}
    >
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>{t("customerPipeline")}</CardTitle>
          <CardDescription>{t("customerPipelineDescription")}</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm">
            {t("customizeColumns")}
          </Button>
          <Button type="button" size="sm">
            {t("addSection")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Table aria-label={t("tableAria")}>
          <TableHeader>
            <TableRow>
              <TableHead>{t("customer")}</TableHead>
              <TableHead>{t("owner")}</TableHead>
              <TableHead>ARR</TableHead>
              <TableHead>{t("stage")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PREVIEW_CUSTOMER_PIPELINE_ROWS.map((row) => (
              <TableRow key={row.customer}>
                <TableCell className="font-medium">{row.customer}</TableCell>
                <TableCell className="text-muted-foreground">{row.owner}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{row.arr}</TableCell>
                <TableCell>{row.stage}</TableCell>
                <TableCell>
                  <Badge variant={row.statusVariant}>{row.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button type="button" size="sm" variant="ghost" aria-label={row.actionLabel}>
                    {row.actionText}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{t("rowsSelected")}</p>
          <div className="flex items-center gap-2">
            <span>{t("pageCount")}</span>
            <Button type="button" variant="outline" size="icon-xs" aria-label={t("previousPage")}>
              <ChevronLeft aria-hidden />
            </Button>
            <Button type="button" variant="outline" size="icon-xs" aria-label={t("nextPage")}>
              <ChevronRight aria-hidden />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
