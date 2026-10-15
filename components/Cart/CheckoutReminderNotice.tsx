import React from 'react';
import { Link } from 'react-router-dom';

interface CheckoutReminderNoticeProps {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
  // Opens the policy in a new tab where leaving the page would lose unsaved state (sample selection).
  newTab?: boolean;
}

// The reminder for an unfinished checkout also goes to people without marketing
// consent (§ 116 ods. 15 zákona č. 452/2021 Z. z.), which requires offering the
// refusal before the e-mail is collected in the Shopify checkout. Shown next to
// every button that opens the checkout; wording matches PrivacyPolicy, section 2.
export const CheckoutReminderNotice = ({ className, linkClassName, onNavigate, newTab }: CheckoutReminderNoticeProps) => (
  <p className={className}>
    Ak v pokladni zadáte e-mail a nákup nedokončíte, pošleme vám k nemu jedno pripomenutie, aj keď nezaškrtnete súhlas s novinkami.
    Pripomenutie máte právo kedykoľvek bezplatne odmietnuť odkazom v ňom alebo na{' '}
    <a href="mailto:info@orostone.sk" className={linkClassName}>info@orostone.sk</a>.{' '}
    <Link
      to="/ochrana-sukromia#ucel"
      className={linkClassName}
      onClick={onNavigate}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      Ochrana súkromia
    </Link>
  </p>
);
