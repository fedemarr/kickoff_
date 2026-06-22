-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SELECCIONES', 'CLUBES', 'EQUIPAMIENTO');

-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('NONE', 'NEW', 'SALE', 'FEATURED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MERCADOPAGO', 'TRANSFER', 'CASH');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EncargoStatus" AS ENUM ('PENDING', 'CONTACTED', 'CONFIRMED', 'ORDERED', 'ARRIVED', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "details" TEXT,
    "returns" TEXT,
    "sizeChart" TEXT,
    "brand" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "images" TEXT[],
    "tag" "Tag" NOT NULL DEFAULT 'NONE',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT,
    "price" INTEGER NOT NULL,
    "oldPrice" INTEGER,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Argentina',
    "notes" TEXT,
    "subtotal" INTEGER NOT NULL,
    "shippingCost" INTEGER NOT NULL DEFAULT 0,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "couponCode" TEXT,
    "total" INTEGER NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "mpPaymentId" TEXT,
    "mpPreferenceId" TEXT,
    "transferProof" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "shippingCompany" TEXT,
    "trackingCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "minAmount" INTEGER,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "bannerText" TEXT NOT NULL DEFAULT '3 cuotas sin interés · 10% OFF con transferencia',
    "heroTitle" TEXT NOT NULL DEFAULT 'Camisetas oficiales de rugby',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Selecciones · Clubes · Equipamiento',
    "heroCtaText" TEXT NOT NULL DEFAULT 'Ver catálogo',
    "freeShippingFrom" INTEGER NOT NULL DEFAULT 150000,
    "transferDiscount" INTEGER NOT NULL DEFAULT 10,
    "installments" INTEGER NOT NULL DEFAULT 3,
    "primaryColor" TEXT NOT NULL DEFAULT '#B91C1C',
    "instagram" TEXT NOT NULL DEFAULT '@kickoff.tienda',
    "tiktok" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT 'kickoff@tienda.com',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "cbu" TEXT NOT NULL DEFAULT '',
    "alias" TEXT NOT NULL DEFAULT '',
    "bankHolder" TEXT NOT NULL DEFAULT '',
    "statClients" TEXT NOT NULL DEFAULT '+2K',
    "statModels" TEXT NOT NULL DEFAULT '+500',
    "statSelecciones" TEXT NOT NULL DEFAULT '20+',
    "statYears" TEXT NOT NULL DEFAULT '3',
    "shippingDeadlineText" TEXT NOT NULL DEFAULT 'Comprá hoy y despachamos mañana a primera hora',
    "encargoWindowOpen" BOOLEAN NOT NULL DEFAULT true,
    "encargoWindow1Start" INTEGER NOT NULL DEFAULT 1,
    "encargoWindow1End" INTEGER NOT NULL DEFAULT 15,
    "encargoWindow2Start" INTEGER NOT NULL DEFAULT 16,
    "encargoWindow2End" INTEGER NOT NULL DEFAULT 31,
    "encargoWhatsapp" TEXT NOT NULL DEFAULT '',
    "encargoDeliveryTime" TEXT NOT NULL DEFAULT '15 a 30 días hábiles',
    "encargoLegalText" TEXT NOT NULL DEFAULT 'Los encargos no tienen stock asegurado hasta confirmar con el equipo de KickOff. El tiempo de entrega estimado es de 15 a 30 días hábiles. El precio puede variar según el tipo de cambio al momento de confirmar.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EncargoProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "season" TEXT,
    "origin" TEXT,
    "nation" TEXT,
    "league" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EncargoProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encargo" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "notes" TEXT,
    "status" "EncargoStatus" NOT NULL DEFAULT 'PENDING',
    "ventana" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Encargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitlistEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_active_idx" ON "Product"("active");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EncargoProduct_slug_key" ON "EncargoProduct"("slug");

-- CreateIndex
CREATE INDEX "Encargo_status_idx" ON "Encargo"("status");

-- CreateIndex
CREATE INDEX "Encargo_createdAt_idx" ON "Encargo"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistEmail_email_key" ON "WaitlistEmail"("email");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encargo" ADD CONSTRAINT "Encargo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "EncargoProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
