import pandas as pd
import os

csv_path = os.path.dirname(__file__)+"/data/"

energy_use = pd.read_csv(csv_path + "energy_use.csv")

energy_use.loc[energy_use['Use'] == 'Diesel', 'Annual consumption'] = 1000
energy_use.loc[energy_use['Use'] == 'Coal', 'Annual consumption'] = 1000
energy_use.loc[energy_use['Use'] == 'Biogas', 'Annual consumption'] = 1000

energy_use["GHG emissions teqCO2"] = energy_use["EF kg eqCO2/Unit)"] * energy_use["Annual consumption"] / 1000
print(energy_use)

total_teqCO2 = energy_use["GHG emissions teqCO2"].sum()
print(total_teqCO2)

