import sys
import os
# Ensure root directory is on path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.core.database import SessionLocal, Base, engine
from backend.app.models.db_models import (
    Machine, Material, Workforce, ProductionOrder, Role, User
)

def seed_demo_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        print("Seeding demo machines...")
        machines_data = [
            {"machine_code": "MCH-101", "name": "CNC Milling Cell 1", "category": "Milling", "capacity_utilization": 96.5, "downtime_hours": 14.5, "maintenance_overdue_days": 12, "status": "Maintenance Required"},
            {"machine_code": "MCH-102", "name": "5-Axis Lathe Center", "category": "Turning", "capacity_utilization": 65.0, "downtime_hours": 1.0, "maintenance_overdue_days": 0, "status": "Operational"},
            {"machine_code": "MCH-103", "name": "Robotic Welding Station", "category": "Welding", "capacity_utilization": 88.0, "downtime_hours": 8.0, "maintenance_overdue_days": 5, "status": "Operational"},
            {"machine_code": "MCH-104", "name": "Laser Cutting Unit A", "category": "Cutting", "capacity_utilization": 99.0, "downtime_hours": 26.0, "maintenance_overdue_days": 18, "status": "Offline"},
            {"machine_code": "MCH-105", "name": "Precision Surface Grinder", "category": "Grinding", "capacity_utilization": 72.0, "downtime_hours": 0.5, "maintenance_overdue_days": 0, "status": "Operational"}
        ]
        
        for m_data in machines_data:
            existing = db.query(Machine).filter(Machine.machine_code == m_data["machine_code"]).first()
            if not existing:
                db.add(Machine(**m_data))
                
        print("Seeding demo materials...")
        materials_data = [
            {"material_code": "MAT-7075", "name": "Aluminum 7075-T6 Plate", "stock_quantity": 450.0, "unit": "kg", "availability_pct": 52.0, "supplier_delay_days": 5.5, "reorder_level": 500.0},
            {"material_code": "MAT-316L", "name": "Stainless Steel 316L Rod", "stock_quantity": 1800.0, "unit": "meters", "availability_pct": 98.0, "supplier_delay_days": 0.0, "reorder_level": 400.0},
            {"material_code": "MAT-TITAN", "name": "Titanium Ti-6Al-4V Bar", "stock_quantity": 120.0, "unit": "kg", "availability_pct": 40.0, "supplier_delay_days": 7.0, "reorder_level": 250.0},
            {"material_code": "MAT-POLY", "name": "Polymer Resin Grade B", "stock_quantity": 2500.0, "unit": "liters", "availability_pct": 92.0, "supplier_delay_days": 0.5, "reorder_level": 500.0}
        ]
        for mat_data in materials_data:
            existing = db.query(Material).filter(Material.material_code == mat_data["material_code"]).first()
            if not existing:
                db.add(Material(**mat_data))
                
        print("Seeding demo workforce...")
        workforce_data = [
            {"operator_code": "OP-501", "full_name": "Marcus Vance", "shift_type": "Day", "availability_pct": 95.0, "skill_index": 0.95},
            {"operator_code": "OP-502", "full_name": "Elena Rostova", "shift_type": "Night", "availability_pct": 60.0, "skill_index": 0.70},
            {"operator_code": "OP-503", "full_name": "Chen Wei", "shift_type": "Day", "availability_pct": 88.0, "skill_index": 0.90},
            {"operator_code": "OP-504", "full_name": "Sarah Jenkins", "shift_type": "Rotating", "availability_pct": 50.0, "skill_index": 0.65}
        ]
        for wf_data in workforce_data:
            existing = db.query(Workforce).filter(Workforce.operator_code == wf_data["operator_code"]).first()
            if not existing:
                db.add(Workforce(**wf_data))
                
        db.commit()
        
        print("Seeding demo orders representing LOW, MEDIUM, HIGH, CRITICAL risks...")
        demo_orders = [
            # 1. CRITICAL RISK (Machine & Material Crisis)
            {
                "order_id": "ORD-CRIT-901",
                "product_family": "Engine_Gamma",
                "order_quantity": 1200,
                "planned_duration_days": 5.0,
                "order_priority": "Critical",
                "shift_type": "Night",
                "machine_capacity_utilization": 98.5,
                "machine_downtime_hours": 24.0,
                "maintenance_overdue_days": 14,
                "material_availability_pct": 45.0,
                "supplier_delay_days": 6.5,
                "workforce_availability_pct": 55.0,
                "workforce_skill_index": 0.65,
                "active_workload_orders": 16,
                "status": "In Progress"
            },
            # 2. HIGH RISK (Machine Breakdown & Overload)
            {
                "order_id": "ORD-HIGH-802",
                "product_family": "Precision_Gear",
                "order_quantity": 850,
                "planned_duration_days": 4.0,
                "order_priority": "High",
                "shift_type": "Day",
                "machine_capacity_utilization": 94.0,
                "machine_downtime_hours": 12.0,
                "maintenance_overdue_days": 8,
                "material_availability_pct": 82.0,
                "supplier_delay_days": 1.5,
                "workforce_availability_pct": 80.0,
                "workforce_skill_index": 0.80,
                "active_workload_orders": 12,
                "status": "Scheduled"
            },
            # 3. MEDIUM RISK (Workforce Shortage)
            {
                "order_id": "ORD-MED-703",
                "product_family": "Hydraulic_Delta",
                "order_quantity": 400,
                "planned_duration_days": 6.0,
                "order_priority": "Medium",
                "shift_type": "Rotating",
                "machine_capacity_utilization": 78.0,
                "machine_downtime_hours": 2.5,
                "maintenance_overdue_days": 1,
                "material_availability_pct": 88.0,
                "supplier_delay_days": 0.5,
                "workforce_availability_pct": 62.0,
                "workforce_skill_index": 0.72,
                "active_workload_orders": 7,
                "status": "Scheduled"
            },
            # 4. LOW RISK (Optimal Parameters)
            {
                "order_id": "ORD-LOW-604",
                "product_family": "Assembly_Alpha",
                "order_quantity": 250,
                "planned_duration_days": 3.0,
                "order_priority": "Low",
                "shift_type": "Day",
                "machine_capacity_utilization": 62.0,
                "machine_downtime_hours": 0.0,
                "maintenance_overdue_days": 0,
                "material_availability_pct": 98.0,
                "supplier_delay_days": 0.0,
                "workforce_availability_pct": 96.0,
                "workforce_skill_index": 0.95,
                "active_workload_orders": 3,
                "status": "Scheduled"
            },
            # 5. MEDIUM-HIGH RISK (Material Shortage)
            {
                "order_id": "ORD-MAT-505",
                "product_family": "Component_Beta",
                "order_quantity": 1500,
                "planned_duration_days": 7.5,
                "order_priority": "High",
                "shift_type": "Day",
                "machine_capacity_utilization": 82.0,
                "machine_downtime_hours": 1.5,
                "maintenance_overdue_days": 0,
                "material_availability_pct": 50.0,
                "supplier_delay_days": 5.0,
                "workforce_availability_pct": 90.0,
                "workforce_skill_index": 0.88,
                "active_workload_orders": 6,
                "status": "Scheduled"
            }
        ]
        
        for ord_data in demo_orders:
            existing = db.query(ProductionOrder).filter(ProductionOrder.order_id == ord_data["order_id"]).first()
            if not existing:
                db.add(ProductionOrder(**ord_data))
                
        db.commit()
        print("Demo data seeded successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
