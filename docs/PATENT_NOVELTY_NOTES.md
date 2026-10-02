# Patent Novelty Analysis & Technical Notes

**Proposed Invention Title:** System and Counterfactual Engine for Adaptive Production Delay Mitigation via Explainable Feature Attribution  
**Status:** Academic Research / Patent Preparation Notes  

> [!IMPORTANT]
> **Legal Disclaimer:** This document provides preliminary technical analysis of inventive aspects for research documentation. This does NOT constitute a formal legal patent opinion. Formal patentability requires prior-art search, non-obviousness examination, and professional legal counsel.

---

## 1. Technical Contribution Overview
The platform introduces a novel architecture connecting **Explainable AI (SHAP)** with **Counterfactual Action Impact Estimation**:

```mermaid
graph LR
    Telemetry[Order Parameters] --> SHAP[SHAP Feature Attribution]
    SHAP --> RootCause[Root-Cause Vector]
    RootCause --> ActionGen[Candidate Action Generator]
    ActionGen --> Counterfactual[Counterfactual Regressor Simulator]
    Counterfactual --> Ranking[Action Improvement Ranking]
    Ranking --> Decision[Optimal Action Recommendation]
```

## 2. Potential Areas of Invention / Novelty Claims

### Claim Area A: Counterfactual Interventions via Feature Attribution Maps
* **Standard Practice:** Existing MES systems provide static rule-based alerts or display feature importance charts without mapping attributions to actionable counterfactual states.
* **Proposed Approach:** The engine maps positive SHAP contribution vectors directly to corresponding domain intervention transformations (e.g., machine downtime $\to$ maintenance micro-stoppage, material availability deficit $\to$ stock reallocation), passes transformed feature vectors into a pre-trained duration regressor, and computes $\Delta \text{Delay} = \text{Delay}_{\text{baseline}} - \text{Delay}_{\text{counterfactual}}$.

### Claim Area B: Dynamic Multi-Factor Risk Normalization
* **Standard Practice:** Industrial risk indices use simplistic linear weighted averages of sensor metrics.
* **Proposed Approach:** Dynamic combination of non-linear classification probability, non-linear duration severity, machine degradation ratios, and material supply chain lead-time deficits normalized across standardized 0–100 risk bands.

## 3. Prior Art & Differentiation Analysis
1. **US Patent US10929789B2 (Predictive Manufacturing Delay Alerting):** Focuses solely on threshold alarms without counterfactual impact estimation or SHAP cause attribution.
2. **EP Patent EP3450982A1 (Shop Floor Scheduling Optimization):** Uses static constraint programming without machine learning explainability or adaptive action ranking.

## 4. Assessment Matrix
| Dimension | Existing Industrial MES | Proposed Adaptive Platform |
| :--- | :--- | :--- |
| Delay Prediction | Static post-hoc logging | Real-time ML XGBoost classification & duration regression |
| Explainability | None / Black-box model | SHAP feature contribution percentage breakdown |
| Action Generation | Manual operator intuition | Automated domain action candidate generation |
| Impact Quantification | Unquantified guessing | Counterfactual expected delay reduction ranking |
