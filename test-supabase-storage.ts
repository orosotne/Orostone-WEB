// Test skript na overenie Supabase Storage bucketu
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfkznvqufhnrphpdhfnc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhma3pudnF1ZmhucnBocGRoZm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3ODM5MTUsImV4cCI6MjA4MzM1OTkxNX0.naoKuHD3QgQbZkWri00QLLhfgm9Ej-C0JdF2zF0-GBY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCollectionGalleriesBucket() {
  console.log('🔍 Testujem Supabase Storage bucket: collection-galleries');
  console.log('='.repeat(60));

  try {
    // 1. Overiť či bucket existuje
    console.log('\n1️⃣ Kontrolujem či bucket existuje...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('❌ Chyba pri načítaní bucketov:', bucketsError);
      return;
    }

    const collectionBucket = buckets?.find(b => b.id === 'collection-galleries');

    if (collectionBucket) {
      console.log('✅ Bucket "collection-galleries" existuje!');
      console.log('   - Public:', collectionBucket.public);
      console.log('   - File size limit:', collectionBucket.file_size_limit, 'bytes');
      console.log('   - Allowed MIME types:', collectionBucket.allowed_mime_types);
    } else {
      console.log('❌ Bucket "collection-galleries" neexistuje!');
      console.log('   Dostupné buckety:', buckets?.map(b => b.id).join(', '));
      return;
    }

    // 2. Overiť či sú vytvorené priečinky
    console.log('\n2️⃣ Kontrolujem priečinky v buckete...');
    const folders = ['unita-gallery', 'marbelito-gallery', 'bianco-gallery', 'space-black-gallery'];

    for (const folder of folders) {
      const { data: files, error: listError } = await supabase.storage
        .from('collection-galleries')
        .list(folder, { limit: 1 });

      if (listError) {
        console.log(`⚠️  Priečinok "${folder}": neexistuje alebo je prázdny`);
        console.log(`   Chyba:`, listError.message);
      } else if (files && files.length > 0) {
        console.log(`✅ Priečinok "${folder}": obsahuje ${files.length} súborov`);
      } else {
        console.log(`⚠️  Priečinok "${folder}": je prázdny`);
      }
    }

    // 3. Test verejného prístupu
    console.log('\n3️⃣ Testujem verejný prístup k obrázkom...');
    const testPath = 'unita-gallery/test.jpg';
    const { data: urlData } = supabase.storage
      .from('collection-galleries')
      .getPublicUrl(testPath);

    if (urlData?.publicUrl) {
      console.log('✅ Verejná URL sa dá vygenerovať:');
      console.log('  ', urlData.publicUrl);
    } else {
      console.log('❌ Nepodarilo sa vygenerovať verejnú URL');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Test dokončený!');

  } catch (error) {
    console.error('❌ Neočakávaná chyba:', error);
  }
}

// Spustiť test
testCollectionGalleriesBucket();
