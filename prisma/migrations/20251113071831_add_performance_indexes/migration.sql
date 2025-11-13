-- CreateIndex
CREATE INDEX "invoices_date_idx" ON "invoices"("invoice_date");

-- CreateIndex
CREATE INDEX "invoices_net_total_idx" ON "invoices"("net_total");

-- CreateIndex
CREATE INDEX "shops_owner_name_idx" ON "shops"("owner_name");

-- CreateIndex
CREATE INDEX "shops_balance_idx" ON "shops"("balance_amount");
