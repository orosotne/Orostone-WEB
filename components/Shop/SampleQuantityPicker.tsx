import { formatSamplePrice, quoteSampleOrder, type SampleQuantity } from '../../services/shopify/samples';
import './SampleQuantityPicker.css';

interface SampleQuantityPickerProps {
  value: SampleQuantity;
  onChange: (quantity: SampleQuantity) => void;
  disabled?: boolean;
  id: string;
  feedback?: string;
}

export function SampleQuantityPicker({ value, onChange, disabled = false, id, feedback = '' }: SampleQuantityPickerProps) {
  return (
    <fieldset id={id} disabled={disabled} className="sample-quantity">
      <legend>Koľko vzoriek si želáte?</legend>
      <p id={`${id}-rule`} className="sample-quantity-rule">Každá ďalšia vzorka 4,90 €.</p>
      <div className="sample-quantity-options">
        {([1, 2, 3] as const).map((count) => (
          <label key={count}>
            <input type="radio" name={id} value={count} checked={count === value} onChange={() => onChange(count)} aria-describedby={`${id}-rule ${id}-quote`} />
            <span>
              <span className="sample-quantity-count"><strong>{count}</strong><small>{count === 1 ? 'vzorka' : 'vzorky'}</small></span>
              <span className="sample-quantity-option-price">{formatSamplePrice(quoteSampleOrder(count).totalCents)}</span>
            </span>
          </label>
        ))}
      </div>
      <p id={`${id}-quote`} className="sample-quantity-caption">Ceny zahŕňajú jednu dopravu 2,50 €.</p>
      <p role="status" aria-live="polite" className="sample-quantity-feedback">{feedback}</p>
    </fieldset>
  );
}
