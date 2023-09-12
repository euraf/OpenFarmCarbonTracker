import pandas as pd
import os

csv_path = os.path.dirname(__file__) + "/data/"

carbon_storage_in_soils_land_use_change = pd.read_csv(
    csv_path + "carbon_storage_in_soils_land_use_change.csv"
)
forestry_increase_table = pd.read_csv(csv_path + "forestry_increase.csv")
increase_of_c_for_vineyard_and_orchards = pd.read_csv(
    csv_path + "increase_of_c_for_vineyard_and_orchards.csv"
)
low_natural_elements_storage = pd.read_csv(
    csv_path + "low_natural_elements_storage.csv"
)
shrubby_natural_elements_storage = pd.read_csv(
    csv_path + "shrubby_natural_elements_storage.csv"
)
tree_natural_elements_storage = pd.read_csv(
    csv_path + "tree_natural_elements_storage.csv"
)

# ---------------------------------------------
# Natural Elements ( Trees, shrubs, hedges, etc.)
# ---------------------------------------------

natural_elements = pd.read_csv(csv_path + "natural_elements.csv")


def add_natural_element(
    natural_elements, country, title, surface_m2, quality_of_forestry_station, height
):
    full_name = country + quality_of_forestry_station

    station_forestry_increase_tC = float(
        forestry_increase_table.loc[
            forestry_increase_table["full name"] == full_name, "Forestry increase in tC"
        ].iloc[0]
    )
    # print("station_forestry_increase_tC", station_forestry_increase_tC)
    current_co2_storage_tC_per_ha = 0

    if height == "tall_tree":  # > 5 m high
        current_co2_storage_tC_per_ha = tree_natural_elements_storage.loc[
            tree_natural_elements_storage["Title"] == title,
            "Current C storage (soil + wood)",
        ].iloc[0]
    elif height == "medium_shrub":  # > 1 m high
        current_co2_storage_tC_per_ha = shrubby_natural_elements_storage.loc[
            shrubby_natural_elements_storage["Title"] == title,
            "Current C storage (soil + wood)",
        ].iloc[0]
    elif height == "low":  # < 1 m high
        current_co2_storage_tC_per_ha = low_natural_elements_storage.loc[
            low_natural_elements_storage["Title"] == title,
            "Current C storage (soil + wood)",
        ].iloc[0]

    current_co2_storage_tC = surface_m2 * current_co2_storage_tC_per_ha / 10000
    annual_forestry_increase_tC_per_year = (
        station_forestry_increase_tC * float(surface_m2) / 10000
    )

    new_data = {
        "Country": country,
        "Title": title,
        "Surface (m2)": surface_m2,
        "Quality of forestry station": quality_of_forestry_station,
        "full name": full_name,
        "Current C storage (soil + wood)": current_co2_storage_tC_per_ha,
        "Current C storage": current_co2_storage_tC,
        "Annual forestry increase": annual_forestry_increase_tC_per_year,
    }
    temp = pd.DataFrame({k: [v] for k, v in new_data.items()})

    return pd.concat([natural_elements, temp], ignore_index=True)


natural_elements = add_natural_element(
    natural_elements,
    "France",
    "Maintained hedgerow 3 stratum",
    3000,
    "average",
    "tall_tree",
)
natural_elements = add_natural_element(
    natural_elements,
    "France",
    "Damaged hedgerow (L basis <1,5 m)",
    2000,
    "average",
    "tall_tree",
)
natural_elements = add_natural_element(
    natural_elements, "France", "Shrubby hedgerow", 2000, "favorable", "medium_shrub"
)

annual_forestry_increase_sum = natural_elements["Annual forestry increase"].sum()
current_c_storage_sum = natural_elements["Current C storage"].sum()

print("Natural elements, annual_forestry_increase_sum (tC/year)", annual_forestry_increase_sum)
print("Natural elements, current_c_storage_sum (tC)", current_c_storage_sum)

# print(natural_elements)


# ---------------------------------------------
# Vineyards and orchards
# ---------------------------------------------

vinyard_and_orchard = pd.read_csv(csv_path + "vineyards_and_orchards.csv")


def add_vinyard_and_orchard(vinyard_and_orchard, country, title, surface_m2):
    full_name = country + title
    increase_of_tC_per_ha_per_year = float(
        increase_of_c_for_vineyard_and_orchards.loc[
            increase_of_c_for_vineyard_and_orchards["full name"] == full_name,
            "Increase of Carbon (t  C / ha / year)",
        ].iloc[0]
    )
    increase_of_tC_per_year = increase_of_tC_per_ha_per_year * surface_m2

    new_data = {
        "Country": country,
        "Title": title,
        "Surface (m2)": surface_m2,
        "full name": full_name,
        "Increase of Carbon (t  C / ha / year)": increase_of_tC_per_ha_per_year,
        "Increase of C in wood (tC/year)": increase_of_tC_per_year,
    }
    temp = pd.DataFrame({k: [v] for k, v in new_data.items()})
    return pd.concat([vinyard_and_orchard, temp], ignore_index=True)


vinyard_and_orchard = add_vinyard_and_orchard(
    vinyard_and_orchard, "France", "Vineyard (vine stock)", 10
)

annual_C_increase_sum = vinyard_and_orchard["Increase of C in wood (tC/year)"].sum()

print("Vinyards, Annual_C_increase_sum (tC/year):", annual_C_increase_sum)


# ---------------------------------------------
# Land-use change in the last 20 years at the farm scale
# ---------------------------------------------

landuse_change = pd.read_csv(csv_path + "land-use_change.csv")

def add_landuse_change(landuse_change, conversion_type, surface):

  full_conversion_type = "Conversion of "+conversion_type
  landuse_change.loc[
      landuse_change["Land-use changes"] == full_conversion_type,
      "Surface (changes)",
  ] = surface

  C_stock_variation_in_soils_tC_per_ha_year = float(carbon_storage_in_soils_land_use_change.loc[carbon_storage_in_soils_land_use_change["Land-use changes"] == full_conversion_type, "Change in soils carbon stock (t C/ha/year, moy sur 20 ans)"])
  C_stock_variation_in_soils_tC_per_year = C_stock_variation_in_soils_tC_per_ha_year * surface



  new_data = {
     "Land-use changes": full_conversion_type,
     "Surface (changes)": surface,
     "Carbon stock variation in soils (tC/ha/year)": C_stock_variation_in_soils_tC_per_ha_year,
     "Carbon stock variation in soils (tC/year)": C_stock_variation_in_soils_tC_per_year,
  };

  temp = pd.DataFrame({k: [v] for k, v in new_data.items()})
  return pd.concat([landuse_change, temp], ignore_index=True)


landuse_change = add_landuse_change(landuse_change, "forest to cropland", 1)
landuse_change = add_landuse_change(landuse_change, "forest to grassland", 2)
landuse_change = add_landuse_change(landuse_change, "grassland to cropland", 3)
landuse_change = add_landuse_change(landuse_change, "grassland to forest", 4)
landuse_change = add_landuse_change(landuse_change, "cropland to grassland", 5)
landuse_change = add_landuse_change(landuse_change, "cropland to forest", 6)

# print(landuse_change.shape)
print("Land-use Change, Carbon stock variation in soils (tC/year):", landuse_change["Carbon stock variation in soils (tC/year)"].sum())
