import { useTranslation } from 'react-i18next'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import TranslateIcon from '@mui/icons-material/Translate';
export default function LanguageSwitcher(){
  const { i18n, t } = useTranslation()
  const value = i18n.language
  const handle = (_, lang) => { if (!lang) return; i18n.changeLanguage(lang); localStorage.setItem('lang', lang) }
  return (<ToggleButtonGroup 
    size='small' 
    value={value} 
    exclusive 
    onChange={handle} 
    aria-label={t('language')}
    sx={{
      bgcolor: '#ffcc80',
      borderRadius: 2,
      '& .MuiToggleButton-root': {
        color: '#333',
        border: 'none',
        '&.Mui-selected': {
          bgcolor: '#ff9800',
          color: 'white',
          '&:hover': {
            bgcolor: '#f57c00'
          }
        },
        '&:hover': {
          bgcolor: '#ffb74d'
        }
      }
    }}
  >
      <ToggleButton value='en'><TranslateIcon fontSize='small'/> EN</ToggleButton>
      <ToggleButton value='hi'>हिंदी</ToggleButton>
    </ToggleButtonGroup>)
}
