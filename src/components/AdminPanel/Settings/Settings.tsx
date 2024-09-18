import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Slider, Button, Switch, FormControlLabel } from '@mui/material';
import { fetchSettings, updateSettings } from '../../../services/settingsService';

const Settings = () => {
  const [settings, setSettings] = useState({
    defaultEtsySalePercentage: 0,
    defaultProfitPercentage: 0,
    defaultShopifySalePercentage: 0,
    mockupGridHorizontal: 0,
    mockupGridVertical: 0,
    defaultFreeShippingEtsy: false,
    defaultFreeShippingShopify: false,
  });

  useEffect(() => {
    const loadSettings = async () => {
      const fetchedSettings = await fetchSettings();
      setSettings({
        defaultEtsySalePercentage: fetchedSettings.defaultEtsySalePercentage,
        defaultProfitPercentage: fetchedSettings.defaultProfitPercentage,
        defaultShopifySalePercentage: fetchedSettings.defaultShopifySalePercentage,
        mockupGridHorizontal: fetchedSettings.mockupGrid.horizontal,
        mockupGridVertical: fetchedSettings.mockupGrid.vertical,
        defaultFreeShippingEtsy: fetchedSettings.defaultFreeShippingEtsy,
        defaultFreeShippingShopify: fetchedSettings.defaultFreeShippingShopify,
      });
    };
    loadSettings();
  }, []);

  const handleSliderChange = (name: string) => (event: Event, value: number | number[]) => {
    setSettings(prev => ({ ...prev, [name]: value as number }));
  };

  const handleInputChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [name]: parseInt(event.target.value, 10) }));
  };

  const handleSwitchChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [name]: event.target.checked }));
  };

  const handleSave = async () => {
    await updateSettings({
      defaultEtsySalePercentage: settings.defaultEtsySalePercentage,
      defaultProfitPercentage: settings.defaultProfitPercentage,
      defaultShopifySalePercentage: settings.defaultShopifySalePercentage,
      mockupGrid: {
        horizontal: settings.mockupGridHorizontal,
        vertical: settings.mockupGridVertical,
      },
      defaultFreeShippingEtsy: settings.defaultFreeShippingEtsy,
      defaultFreeShippingShopify: settings.defaultFreeShippingShopify,
    });
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" style={{ marginBottom: '20px' }}>
        Edit Settings
      </Typography>
      <div style={{ marginBottom: '20px' }}>
        <Typography gutterBottom>Default Etsy Sale Percentage</Typography>
        <Slider
          value={settings.defaultEtsySalePercentage}
          onChange={handleSliderChange('defaultEtsySalePercentage')}
          aria-labelledby="default-etsy-sale-percentage"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={100}
        />
        <TextField
          value={settings.defaultEtsySalePercentage}
          onChange={handleInputChange('defaultEtsySalePercentage')}
          label="Default Etsy Sale Percentage"
          type="number"
          fullWidth
          margin="normal"
          inputProps={{ min: 0, max: 100 }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Typography gutterBottom>Default Profit Percentage</Typography>
        <Slider
          value={settings.defaultProfitPercentage}
          onChange={handleSliderChange('defaultProfitPercentage')}
          aria-labelledby="default-profit-percentage"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={500}
        />
        <TextField
          value={settings.defaultProfitPercentage}
          onChange={handleInputChange('defaultProfitPercentage')}
          label="Default Profit Percentage"
          type="number"
          fullWidth
          margin="normal"
          inputProps={{ min: 0, max: 500 }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Typography gutterBottom>Default Shopify Sale Percentage</Typography>
        <Slider
          value={settings.defaultShopifySalePercentage}
          onChange={handleSliderChange('defaultShopifySalePercentage')}
          aria-labelledby="default-shopify-sale-percentage"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={100}
        />
        <TextField
          value={settings.defaultShopifySalePercentage}
          onChange={handleInputChange('defaultShopifySalePercentage')}
          label="Default Shopify Sale Percentage"
          type="number"
          fullWidth
          margin="normal"
          inputProps={{ min: 0, max: 100 }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Typography gutterBottom>Default Mockup Grid Size</Typography>
        <Typography gutterBottom>Horizontal</Typography>
        <Slider
          value={settings.mockupGridHorizontal}
          onChange={handleSliderChange('mockupGridHorizontal')}
          aria-labelledby="mockup-grid-horizontal"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={10}
        />
        <TextField
          value={settings.mockupGridHorizontal}
          onChange={handleInputChange('mockupGridHorizontal')}
          label="Mockup Grid Horizontal"
          type="number"
          fullWidth
          margin="normal"
          inputProps={{ min: 1, max: 10 }}
        />
        <Typography gutterBottom>Vertical</Typography>
        <Slider
          value={settings.mockupGridVertical}
          onChange={handleSliderChange('mockupGridVertical')}
          aria-labelledby="mockup-grid-vertical"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={10}
        />
        <TextField
          value={settings.mockupGridVertical}
          onChange={handleInputChange('mockupGridVertical')}
          label="Mockup Grid Vertical"
          type="number"
          fullWidth
          margin="normal"
          inputProps={{ min: 1, max: 10 }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.defaultFreeShippingEtsy}
              onChange={handleSwitchChange('defaultFreeShippingEtsy')}
            />
          }
          label="Default Free Shipping on Etsy"
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.defaultFreeShippingShopify}
              onChange={handleSwitchChange('defaultFreeShippingShopify')}
            />
          }
          label="Default Free Shipping on Shopify"
        />
      </div>
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </Container>
  );
};

export default Settings;
