-- ===========================================
-- OROSTONE E-SHOP DATABASE SCHEMA EXTENSION
-- ===========================================
-- Spusti tento SQL v Supabase SQL Editor PO základnej schéme
-- https://supabase.com/dashboard/project/_/sql

-- ===========================================
-- 1. NOVÉ ENUMY PRE E-SHOP
-- ===========================================

-- Status objednávky
CREATE TYPE order_status AS ENUM (
    'pending',      -- Čaká na platbu
    'paid',         -- Zaplatená
    'processing',   -- Spracováva sa
    'shipped',      -- Odoslaná
    'delivered',    -- Doručená
    'cancelled'     -- Zrušená
);

-- Status platby
CREATE TYPE payment_status AS ENUM (
    'pending',      -- Čaká
    'processing',   -- Spracováva sa
    'succeeded',    -- Úspešná
    'failed',       -- Zlyhala
    'refunded'      -- Vrátená
);

-- ===========================================
-- 2. KATEGÓRIE PRODUKTOV
-- ===========================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Základné kategórie
INSERT INTO categories (name, slug, description, sort_order) VALUES
    ('Mramor', 'mramor', 'Verná imitácia mramoru s prepracovaným žilovaním', 1),
    ('Granit', 'granit', 'Odolné granitové vzory pre náročné prostredia', 2),
    ('Betón', 'beton', 'Industriálny vzhľad betónu s výhodami keramiky', 3),
    ('Jednofarebné', 'jednofarebne', 'Čisté línie pre minimalistický dizajn', 4),
    ('Drevo', 'drevo', 'Prirodzený vzhľad dreva bez údržby', 5);

-- ===========================================
-- 3. PRODUKTY
-- ===========================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Základné info
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    
    -- Kategória
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    -- Cena a rozmery
    price_per_m2 DECIMAL(10, 2) NOT NULL,
    dimensions TEXT,              -- "3200 x 1600 mm"
    thickness TEXT,               -- "12mm"
    surface_area DECIMAL(10, 4),  -- m² za kus (napr. 5.12)
    
    -- Sklad
    stock_quantity INTEGER DEFAULT 0,
    is_in_stock BOOLEAN GENERATED ALWAYS AS (stock_quantity > 0) STORED,
    
    -- Stav
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Médiá
    image_url TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,  -- ["url1", "url2", ...]
    
    -- Technické parametre
    metadata JSONB DEFAULT '{}'::jsonb,  -- {finish: "polished", hardness: "7/10", ...}
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 4. OBJEDNÁVKY
-- ===========================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Číslo objednávky (verejné)
    order_number TEXT UNIQUE NOT NULL,
    
    -- Používateľ (môže byť NULL pre guest checkout)
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Kontaktné údaje
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    
    -- Adresy (JSON pre flexibilitu)
    shipping_address JSONB NOT NULL,
    -- Príklad: {"name": "Ján Novák", "street": "Hlavná 1", "city": "Bratislava", "postal_code": "811 01", "country": "SK"}
    billing_address JSONB,
    
    -- Sumy
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Kurzový kód (ak bol použitý)
    discount_code TEXT,
    
    -- Status
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    
    -- Stripe
    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT,
    
    -- Poznámky
    customer_note TEXT,
    admin_note TEXT,
    
    -- Doprava
    shipping_method TEXT DEFAULT 'standard',
    tracking_number TEXT,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 5. POLOŽKY OBJEDNÁVKY
-- ===========================================

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    
    -- Snapshot produktu v čase objednávky
    product_name TEXT NOT NULL,
    product_slug TEXT,
    product_image TEXT,
    
    -- Množstvo a cena
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Extra info
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 6. ADRESY POUŽÍVATEĽOV
-- ===========================================

CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Identifikácia
    label TEXT,  -- "Domov", "Práca", etc.
    
    -- Adresa
    name TEXT NOT NULL,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'SK',
    phone TEXT,
    
    -- Predvolená adresa
    is_default_shipping BOOLEAN DEFAULT false,
    is_default_billing BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 7. ZĽAVOVÉ KÓDY
-- ===========================================

CREATE TABLE discount_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    
    -- Typ zľavy
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    
    -- Obmedzenia
    min_order_value DECIMAL(10, 2),
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    
    -- Platnosť
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 8. INDEXY
-- ===========================================

-- Categories
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

-- Products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_stock ON products(is_in_stock);
CREATE INDEX idx_products_price ON products(price_per_m2);

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Order items
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- User addresses
CREATE INDEX idx_user_addresses_user ON user_addresses(user_id);

-- Discount codes
CREATE INDEX idx_discount_codes_code ON discount_codes(code);
CREATE INDEX idx_discount_codes_active ON discount_codes(is_active);

-- ===========================================
-- 9. TRIGGERY PRE UPDATED_AT
-- ===========================================

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_addresses_updated_at
    BEFORE UPDATE ON user_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 10. ROW LEVEL SECURITY
-- ===========================================

-- Zapnúť RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- CATEGORIES - verejné čítanie
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Categories admin full access" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

-- PRODUCTS - verejné čítanie aktívnych
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Products admin full access" ON products
    FOR ALL USING (auth.role() = 'authenticated');

-- ORDERS - používateľ vidí svoje, admin všetky
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (
        auth.uid() = user_id 
        OR customer_email = auth.jwt()->>'email'
        OR auth.role() = 'authenticated'
    );

CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders admin full access" ON orders
    FOR ALL USING (auth.role() = 'authenticated');

-- ORDER_ITEMS - rovnaké ako orders
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (orders.user_id = auth.uid() OR orders.customer_email = auth.jwt()->>'email')
        )
        OR auth.role() = 'authenticated'
    );

CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

-- USER_ADDRESSES - používateľ vidí svoje
CREATE POLICY "Users can manage own addresses" ON user_addresses
    FOR ALL USING (auth.uid() = user_id);

-- DISCOUNT_CODES - verejné čítanie aktívnych
CREATE POLICY "Active discount codes are viewable" ON discount_codes
    FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Discount codes admin full access" ON discount_codes
    FOR ALL USING (auth.role() = 'authenticated');

-- ===========================================
-- 11. FUNKCIE
-- ===========================================

-- Generovanie čísla objednávky
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    year_prefix TEXT;
    sequence_num INTEGER;
BEGIN
    year_prefix := TO_CHAR(NOW(), 'YY');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 3) AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM orders
    WHERE order_number LIKE year_prefix || '%';
    
    new_number := year_prefix || LPAD(sequence_num::TEXT, 6, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger pre automatické číslo objednávky
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- Aktualizácia skladu po objednávke
CREATE OR REPLACE FUNCTION update_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE products 
        SET stock_quantity = stock_quantity - NEW.quantity
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_trigger
    AFTER INSERT ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_on_order();

-- ===========================================
-- 12. SAMPLE DATA (voliteľné)
-- ===========================================

-- Ak chceš naplniť testovacími dátami, odkomentuj:

/*
INSERT INTO products (name, slug, description, category_id, price_per_m2, dimensions, thickness, stock_quantity, is_active, is_featured, image_url) VALUES
    ('Carrara Statuario Ultra', 'carrara-statuario-ultra', 'Náš bestseller. Dokonalá imitácia talianskeho mramoru s vysokou odolnosťou.', (SELECT id FROM categories WHERE slug = 'mramor'), 189, '3200 x 1600 mm', '12mm', 25, true, true, 'https://picsum.photos/600/800?random=101'),
    ('Nero Marquina Bold', 'nero-marquina-bold', 'Hlboká čierna s výrazným bielym žilovaním pre luxusné interiéry.', (SELECT id FROM categories WHERE slug = 'mramor'), 210, '3200 x 1600 mm', '12mm', 18, true, true, 'https://picsum.photos/600/800?random=102'),
    ('Pietra Grey Soft', 'pietra-grey-soft', 'Elegantná sivá pre minimalistický a moderný vzhľad kuchyne či kúpeľne.', (SELECT id FROM categories WHERE slug = 'granit'), 195, '3200 x 1600 mm', '12mm', 30, true, false, 'https://picsum.photos/600/800?random=103'),
    ('Industrial Concrete', 'industrial-concrete', 'Autentický vzhľad betónu s výhodami keramiky.', (SELECT id FROM categories WHERE slug = 'beton'), 165, '3200 x 1600 mm', '12mm', 40, true, true, 'https://picsum.photos/600/800?random=104'),
    ('Pure White Absolute', 'pure-white-absolute', 'Absolútna biela, najčistejší odtieň na trhu.', (SELECT id FROM categories WHERE slug = 'jednofarebne'), 290, '3200 x 1600 mm', '12mm', 15, true, false, 'https://picsum.photos/600/800?random=105');
*/
