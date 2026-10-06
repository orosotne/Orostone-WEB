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
      <p id={`${id}-rule`} className="sample-quantity-rule"><strong>Prvá vzorka je zadarmo.</strong> Každá ďalšia {formatSamplePrice(quoteSampleOrder(2).samplesCents)}.</p>
      <div className="sample-quantity-options">
        {([1, 2, 3] as const).map((count) => {
          const option = quoteSampleOrder(count);
          return <label key={count}>
            <input type="radio" name={id} value={count} checked={count === value} onChange={() => onChange(count)} aria-describedby={`${id}-rule`} aria-label={`${count} ${count === 1 ? 'vzorka' : 'vzorky'}. Vzorky ${count === 1 ? 'zadarmo' : formatSamplePrice(option.samplesCents)}, doprava ${formatSamplePrice(option.shippingCents)}, spolu ${formatSamplePrice(option.totalCents)}.`} />
            <span>
              <span className="sample-quantity-count"><strong>{count}</strong><small>{count === 1 ? 'vzorka' : 'vzorky'}</small></span>
              <span className="sample-quantity-option-price">{count === 1 ? 'Zadarmo' : formatSamplePrice(option.samplesCents)}</span>
              <span className="sample-quantity-option-note">{count === 1 ? 'iba doprava' : 'za vzorky'}</span>
            </span>
          </label>;
        })}
      </div>
      <p role="status" aria-live="polite" className="sample-quantity-feedback">{feedback}</p>
    </fieldset>
  );
}
