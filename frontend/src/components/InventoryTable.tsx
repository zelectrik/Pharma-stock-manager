import { useState, Fragment } from "react";
import type { InventoryItemWithAlerts } from "../types/medicine";
import AlertBadge from "./AlertBadge";

type Props = {
  inventory: InventoryItemWithAlerts[];
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

export default function InventoryTable({ inventory }: Props) {
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);

  const toggleExpanded = (productId: string) => {
    setExpandedProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  if (inventory.length === 0) {
    return (
      <div className="empty-state">
        <h3>No inventory yet</h3>
        <p>Create a product and add batches to start tracking stock.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Total quantity</th>
            <th>Alerts</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((item) => {
            const isExpanded = expandedProductIds.includes(item.id);

            return (
              <Fragment key={item.id}>
                <tr
                  className="clickable-row"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <td>
                    <div className="medicine-cell">
                      <span className="expand-icon">
                        {isExpanded ? "▾" : "▸"}
                      </span>
                      <strong>{item.name}</strong>
                    </div>
                  </td>

                  <td>{item.totalQuantity}</td>

                  <td>
                    <div className="badges">
                      {item.alerts.length === 0 ? (
                        <AlertBadge alert="OK" />
                      ) : (
                        item.alerts.map((alert) => (
                          <AlertBadge key={alert} alert={alert} />
                        ))
                      )}
                    </div>
                  </td>
                </tr>

                {isExpanded && (
                  <tr className="expanded-row">
                    <td colSpan={3}>
                      <div className="batch-panel">
                        <div className="batch-panel-header">
                          <h4>Batches</h4>
                          <span>{item.batches.length} batch(es)</span>
                        </div>

                        {item.batches.length === 0 ? (
                          <p className="muted">No batch for this product.</p>
                        ) : (
                          <div className="batch-table">
                            <div className="batch-table-header">
                              <span>Quantity</span>
                              <span>Expiration date</span>
                              <span>Alerts</span>
                            </div>

                            {item.batches.map((batch) => (
                              <div key={batch.id} className="batch-table-row">
                                <span>{batch.quantity}</span>
                                <span>{formatDate(batch.expirationDate)}</span>

                                <div className="badges">
                                  {batch.alerts.length === 0 ? (
                                    <AlertBadge alert="OK" />
                                  ) : (
                                    batch.alerts.map((alert) => (
                                      <AlertBadge key={alert} alert={alert} />
                                    ))
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
