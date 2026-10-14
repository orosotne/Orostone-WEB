import React from 'react';
import { Link } from 'react-router-dom';

interface CheckoutReminderNoticeProps {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}

// The reminder for an unfinished checkout also goes to people without marketing
// consent (§ 116 ods. 15 zákona č. 452/2021 Z. z.), which requires offering the
// refusal where the e-mail is collected. Shown next to every button that opens
// the Shopify checkout; wording matches PrivacyPolicy, section 2.
export const CheckoutReminderNotice = ({ className, linkClassName, onNavigate }: CheckoutReminderNoticeProps) => (
  <p className={className}>
    Ak nákup v pokladni nedokončíte, pošleme vám na zadaný e-mail jedno pripomenutie. Máte právo ho kedykoľvek bezplatne odmietnuť:
    stačí kliknúť na odkaz v e-maile alebo napísať na info@orostone.sk.{' '}
    <Link to="/ochrana-sukromia" className={linkClassName} onClick={onNavigate}>Ochrana súkromia</Link>
  </p>
);
