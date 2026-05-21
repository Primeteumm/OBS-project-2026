# Öğrenci Bilgi Sistemi (OBS)

Statik, tek sayfalık bir Öğrenci Bilgi Sistemi (OBS) demosudur. Vanilla HTML/CSS/JS ile yazılmıştır — backend yoktur, tüm veriler tarayıcıda tutulur.

## Canlı Demo

**https://obs-project2026.vercel.app/**

Demo hesabı:
- **Öğrenci No:** `250206022`
- **Şifre:** `password123`

## Özellikler

- **Giriş ekranı** — SHA-256 ile hash'lenmiş şifre doğrulama
- **Ana sayfa (Dashboard)** — kayıtlı ders/kredi sayısı, GANO, devamsızlık uyarısı
- **Ders programı** — haftalık 5 günlük çizelge görünümü
- **Notlar** — vize/final/ortalama/harf notu tablosu ve GANO hesaplama
- **Devamsızlık** — ders bazlı devamsızlık detayları ve %30 sınır uyarısı
- **Ders Ekle/Bırak** — kontenjan ve **saat çakışması kontrolü** ile kayıt
- **Kalıcı veri** — `localStorage` ile oturum ve kayıtlı ders listesi tarayıcıda saklanır

## Teknoloji

- HTML5, CSS3, Vanilla JavaScript (ES6+)
- `Web Crypto API` — şifre hash'leme (SHA-256)
- `localStorage` — oturum ve kullanıcı verileri için kalıcılık
- Hiçbir framework, bundler veya build adımı kullanılmaz

## Mimari

```
.
├── index.html              # Giriş ekranı
├── dashboard.html          # Ana sayfa
├── schedule.html           # Ders programı
├── grades.html             # Notlar
├── attendance.html         # Devamsızlık
├── registration.html       # Ders ekle/bırak
├── css/
│   ├── main.css            # Genel düzen, değişkenler, temel stiller
│   └── components.css      # Buton, kart, tablo, form vb. bileşenler
└── js/
    ├── data.js             # Mock veri: öğrenci, dersler, notlar, devamsızlık
    ├── auth.js             # Giriş/çıkış, oturum, hashPassword, navbar/sidebar
    ├── utils.js            # Storage, GPA, çakışma kontrolü, tarih biçimleme
    ├── schedule.js         # Ders programı tablosu
    ├── grades.js           # Notlar tablosu + GANO özeti
    ├── attendance.js       # Devamsızlık tablosu
    └── registration.js     # Ders ekle/bırak mantığı
```

Her HTML sayfası gerekli JS modüllerini sırayla yükler: önce `data.js`, sonra `auth.js`, `utils.js`, sayfa-özel script.

## Tasarım Kararları

### 1. Şifre Hash'leme (SHA-256)
Demo verisi olmasına rağmen `MOCK_USERS` içinde şifreler düz metin yerine SHA-256 hash'i olarak tutulur. Giriş sırasında kullanıcı şifresi `crypto.subtle.digest("SHA-256", ...)` ile hash'lenip karşılaştırılır. Bu, gerçek bir sisteme yaklaştırma ve güvenlik farkındalığı pratiğidir.

### 2. `localStorage` vs. `sessionStorage`
Önceki sürümde oturum `sessionStorage`'da tutuluyordu — tarayıcı kapanınca silinirdi. `localStorage`'a geçildi: kullanıcı tarayıcıyı kapatıp açtığında girişte kalır, ders ekle/bırak değişiklikleri kalıcı olur. Çıkış (logout) butonu açıkça temizler.

### 3. Paylaşımlı Ders Listesi
`registration.html` sayfasında ders eklendiğinde diğer sayfaların (ana sayfa, ders programı) güncellenmiş listeyi görmesi gerekir. Bunun için `utils.js` içinde `getEnrolled()` helper'ı ve `ENROLLED_KEY` sabiti vardır; tüm sayfalar bu tek noktadan okur.

## Algoritmalar

### GANO (Genel Ağırlıklı Not Ortalaması)
4.0 sistemi. Harf notu → GPA puanı eşlemesi:

| Harf | GPA  | Harf | GPA  |
|------|------|------|------|
| AA   | 4.0  | DC   | 1.5  |
| BA   | 3.5  | DD   | 1.0  |
| BB   | 3.0  | FD   | 0.5  |
| CB   | 2.5  | FF   | 0.0  |
| CC   | 2.0  |      |      |

Formül:
```
GANO = Σ(kredi × gpa) / Σ(kredi)
```

Yalnızca harf notu açıklanmış (tamamlanmış) dersler hesaba katılır; "pending" ve "withdrawn" durumundaki dersler atlanır. Uygulama: `js/utils.js` → `calculateGPA(grades)`.

### Saat Çakışması Kontrolü
Bir ders eklenmeden önce her bir zaman dilimi (slot) mevcut kayıtlı derslerin slot'larıyla karşılaştırılır. İki zaman aralığı çakışır ⟺ aynı güne aittirler **ve**:
```
newStart < existingEnd  ve  newEnd > existingStart
```

Tüm saatler `hour * 60 + minute` formuna çevrilerek dakika cinsinden karşılaştırılır. Çakışma bulunursa "Ekle" butonu devre dışı kalır, hatalı tıklamada toast ile uyarı gösterilir. Uygulama: `js/utils.js` → `checkScheduleConflict(newSlots, existingCourses)`.

### Devamsızlık Uyarısı
Toplam dersin %30'una eşit/üstünde devamsızlık → riskli (kırmızı uyarı). Ana sayfada toplu, devamsızlık sayfasında ders bazında gösterilir.

## Veri Yapıları

Tüm mock veri `js/data.js` içinde JavaScript nesneleri olarak tutulur:

- `MOCK_USERS` — `{ id, passwordHash, name }[]`
- `STUDENT` — öğrenci bilgileri (id, ad, dönem, bölüm, fakülte, sınıf)
- `ENROLLED_COURSES` — kayıtlı dersler; her ders bir `schedule[]` dizisi içerir: `{ day, startHour, startMin, endHour, endMin, room }`
- `AVAILABLE_COURSES` — kayıt yapılabilecek dersler + `quota` / `enrolled` alanları
- `GRADES` — `{ code, name, credits, midterm, final, average, letter, status }`
- `ATTENDANCE` — `{ code, name, totalHours, absentHours, details: { date, status }[] }`

## Test Stratejisi

Statik bir demo olduğu için otomatik test paketi yoktur. Manuel test senaryoları:

| Senaryo | Beklenen Sonuç |
|---------|----------------|
| Yanlış şifre ile giriş | Hata mesajı, yönlendirme yok |
| Doğru şifre ile giriş | Dashboard'a yönlenir |
| Tarayıcı kapat → aç | Hâlâ giriş yapılmış olmalı (localStorage) |
| Çakışan ders ekle | "Çakışma" etiketi, ekle butonu disabled |
| Ders ekle → sayfa yenile | Ders listede kalmalı |
| Ders ekle → ders programına git | Yeni ders programda görünmeli |
| %30'u aşan ders | Dashboard'da kırmızı uyarı |
| Çıkış yap → yenile | Giriş ekranına yönlenir |

## Sınırlılıklar

- Gerçek backend ve veritabanı yoktur — tüm veri tarayıcıda
- Tek kullanıcı, tek dönem demo verisi
- Hashing istemci tarafında — gerçek bir sistemde sunucuda yapılmalıdır
- Mobil için temel responsive var ama tablet/desktop'a optimize
