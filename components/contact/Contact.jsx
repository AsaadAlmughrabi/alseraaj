// alseraaj/components/contact/Contact.jsx
'use client';

import {useState} from 'react';
import styles from './Contact.module.css';
import {useTranslations} from 'next-intl';
import LeafletMap from '@/components/LeafletMap';

const TO_EMAIL = 'Print@alseraaj.com';
const EMAIL2 = 'Sign@alseraaj.com';
const PHONE_DISPLAY1 = '+966 508 640 420';
const PHONE_DISPLAY2 = '+966 138 276 778';
const ADDRESS_TEXT = '7293 18th Street, Al Adamah, 3507, Dammam 32242, Saudi Arabia';
const DIRECTIONS_URL =
  'https://www.google.com/maps/place/%D9%85%D8%B7%D8%A8%D8%B9%D8%A9+%D8%A7%D9%84%D8%B3%D8%B1%D8%A7%D8%AC+%D9%84%D9%84%D8%AF%D8%B9%D8%A7%D9%8A%D8%A9+%D9%88%D8%A7%D9%84%D8%A5%D8%B9%D9%84%D8%A7%D9%86Seraaj+Adv.%E2%80%AD/@26.4331746,50.0783317,14.58z/data=!4m16!1m9!3m8!1s0x3e49fc80c46908cb:0x2b86f48c9fdfc8b2!2z2YXYt9io2LnYqSDYp9mE2LPYsdin2Kwg2YTZhNiv2LnYp9mK2Kkg2YjYp9mE2KXYudmE2KfZhlNlcmFhaiBBZHYu!8m2!3d26.4307984!4d50.0967352!9m1!1b1!16s%2Fg%2F11bz5kjnxz!3m5!1s0x3e49fc80c46908cb:0x2b86f48c9fdfc8b2!8m2!3d26.4307984!4d50.0967352!16s%2Fg%2F11bz5kjnxz?entry=ttu';
const LAT = 26.4307984;
const LNG = 50.0967352;

export default function Contact() {
  const t = useTranslations('contact');

  const [form, setForm] = useState({ name:'', email:'', company:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((f) => ({...f, [k]: v}));

  const buildEmailBody = (f) => [
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    `Company: ${f.company || '-'}`,
    `Subject: ${f.subject || '-'}`,
    '',
    'Message:',
    f.message || '-',
  ].join('\n');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const subject = encodeURIComponent(form.subject || 'New contact message');
      const body = encodeURIComponent(buildEmailBody(form));
      window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </section>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{t('form.title')}</h2>
          <form onSubmit={handleSubmit} className={styles.form} aria-label={t('form.aria')}>
            <div className={styles.fieldRow}>
              <label className={styles.label}>
                {t('form.name')}
                <input
                  className={styles.input}
                  type="text"
                  placeholder={t('form.name_ph')}
                  value={form.name}
                  onChange={(e)=>update('name', e.target.value)}
                  required
                />
              </label>

              <label className={styles.label}>
                {t('form.email')}
                <input
                  className={`${styles.input} ${styles.ltr}`}
                  dir="ltr"
                  inputMode="email"
                  type="email"
                  placeholder={t('form.email_ph')}
                  value={form.email}
                  onChange={(e)=>update('email', e.target.value)}
                  required
                />
              </label>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.label}>
                {t('form.company')}
                <input
                  className={styles.input}
                  type="text"
                  placeholder={t('form.company_ph')}
                  value={form.company}
                  onChange={(e)=>update('company', e.target.value)}
                />
              </label>

              <label className={styles.label}>
                {t('form.subject')}
                <input
                  className={styles.input}
                  type="text"
                  placeholder={t('form.subject_ph')}
                  value={form.subject}
                  onChange={(e)=>update('subject', e.target.value)}
                />
              </label>
            </div>

            <label className={styles.label}>
              {t('form.message')}
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                rows={6}
                placeholder={t('form.message_ph')}
                value={form.message}
                onChange={(e)=>update('message', e.target.value)}
              />
            </label>

            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? (t('form.sending') || 'Sending…') : t('form.cta')}
            </button>
          </form>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <h3 className={styles.sideTitle}>{t('direct.title')}</h3>
            <ul className={styles.contactList} aria-label={t('direct.aria')}>
                              <li><span className={styles.contactIcon}>📞</span><span className={styles.ltr}>{PHONE_DISPLAY1}</span></li>

              <li><span className={styles.contactIcon}>📞</span><span className={styles.ltr}>{PHONE_DISPLAY2}</span></li>
              <li><span className={styles.contactIcon}>✉️</span><span className={styles.ltr}>{TO_EMAIL}</span></li>
                            <li><span className={styles.contactIcon}>✉️</span><span className={styles.ltr}>{EMAIL2}</span></li>

              
            </ul>
          </div>

          <div className={styles.mapShell} aria-label={t('map.aria')}>
            <LeafletMap
              lat={LAT}
              lng={LNG}
              zoom={16}
              popup={ADDRESS_TEXT}
              className={styles.mapInner}
            />
            <div className={styles.mapCard}>
              <strong className={styles.mapTitle}>{t('map.title')}</strong>
              <p className={styles.mapAddr}>
                <span className={styles.ltr}>7293 18th Street</span>, Al Adamah, 3507, Dammam 32242, Saudi Arabia
              </p>
              <a className={`${styles.mapBtn} ${styles.btnLtr}`} href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                {t('map.cta')} →
              </a>
              <div className={styles.ltr} style={{marginTop:8, fontSize:12, color:'#374151'}}>
                {LAT.toFixed(6)}, {LNG.toFixed(6)}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
