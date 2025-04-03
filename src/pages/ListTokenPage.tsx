import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TokenInfoForm from '../forms/TokenInfoForm'
import SocialLinksForm from '../forms/SocialLinksForm'
import AgentConfigurationPopup from '../components/AgentConfigurationPopup'
interface ListTokenPageProps {
  isWalletConnected: boolean
  connectWallet: () => Promise<void>
  walletAddress: string | null
  tokenData: {
    name: string
    symbol: string
    contractAddress: string
    chain: string
    description: string
    website: string
    twitter: string
    telegram: string
    discord: string
    email: string
  } | null
  updateTokenData: (data: any) => void
}

interface SocialAgentConfig {
  enabled: boolean
  name: string
  bio: string
  model: string
  aiKey: string
  voice: string
}

const ListTokenPage = ({ 
  isWalletConnected, 
  connectWallet, 
  walletAddress,
  tokenData: existingTokenData,
  updateTokenData
}: ListTokenPageProps) => {
  const navigate = useNavigate()
  const [tokenData, setTokenData] = useState({
    name: existingTokenData?.name || '',
    symbol: existingTokenData?.symbol || '',
    contractAddress: existingTokenData?.contractAddress || '',
    chain: existingTokenData?.chain || 'ethereum',
    description: existingTokenData?.description || '',
    website: existingTokenData?.website || '',
    twitter: existingTokenData?.twitter || '',
    telegram: existingTokenData?.telegram || '',
    discord: existingTokenData?.discord || '',
    email: existingTokenData?.email || ''
  })
  const [formStep, setFormStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Social agents configuration
  const [showAgentPopup, setShowAgentPopup] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<'twitter' | 'discord' | 'instagram' | null>(null)
  const [socialAgents, setSocialAgents] = useState<{
    twitter: SocialAgentConfig;
    discord: SocialAgentConfig;
    instagram: SocialAgentConfig;
  }>({
    twitter: { enabled: false, name: '', bio: '', model: 'GPT-4 Turbo', aiKey: '', voice: 'Male' },
    discord: { enabled: false, name: '', bio: '', model: 'GPT-4 Turbo', aiKey: '', voice: 'Male' },
    instagram: { enabled: false, name: '', bio: '', model: 'GPT-4 Turbo', aiKey: '', voice: 'Male' }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTokenData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Pass token data up to parent
    updateTokenData(tokenData)
    
    // Simulate form submission and proceed to character creation
    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/create-character')
    }, 1000)
  }

  const nextStep = () => {
    setFormStep(prev => prev + 1)
  }

  const prevStep = () => {
    setFormStep(prev => prev - 1)
  }
  
  const openAgentPopup = (agentType: 'twitter' | 'discord' | 'instagram') => {
    setSelectedAgent(agentType)
    setShowAgentPopup(true)
  }
  
  const closeAgentPopup = () => {
    setShowAgentPopup(false)
    setSelectedAgent(null)
  }
  
  const handleAgentChange = (field: string, value: string | boolean) => {
    if (selectedAgent) {
      setSocialAgents(prev => ({
        ...prev,
        [selectedAgent]: {
          ...prev[selectedAgent],
          [field]: value
        }
      }))
    }
  }
  
  const saveAgentConfig = () => {
    if (selectedAgent) {
      // If name is empty, use token name
      if (!socialAgents[selectedAgent].name.trim()) {
        setSocialAgents(prev => ({
          ...prev,
          [selectedAgent]: {
            ...prev[selectedAgent],
            name: tokenData.name || `${selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1)} Bot`
          }
        }))
      }
      
      // Auto-enable the agent
      setSocialAgents(prev => ({
        ...prev,
        [selectedAgent]: {
          ...prev[selectedAgent],
          enabled: true
        }
      }))
    }
    closeAgentPopup()
  }
  
  const handleToggleAgent = (agentType: 'twitter' | 'discord' | 'instagram', enabled: boolean) => {
    setSocialAgents(prev => ({
      ...prev,
      [agentType]: {
        ...prev[agentType],
        enabled
      }
    }))
  }

  return (
    <section className="bg-blue-dark bg-pattern pt-24 pb-20">
      <div className="container max-w-[800px] mx-auto px-4">
        <div className="border-8 border-black rounded-3xl bg-white shadow-[-3px_3px_0_0_#1f2024] p-10 text-left">
          <h1 className="text-center mb-10">List Your Memecoin</h1>
          
          <form onSubmit={handleSubmit}>
            {formStep === 1 && (
              <TokenInfoForm 
                tokenData={tokenData}
                handleInputChange={handleInputChange}
                nextStep={nextStep}
              />
            )}
            
            {formStep === 2 && (
              <SocialLinksForm 
                tokenData={tokenData}
                handleInputChange={handleInputChange}
                prevStep={prevStep}
                isSubmitting={isSubmitting}
                socialAgents={socialAgents}
                onToggleAgent={handleToggleAgent}
                onConfigureAgent={openAgentPopup}
              />
            )}
          </form>
            
          {/* Agent Configuration Popup */}
          {showAgentPopup && selectedAgent && (
            <AgentConfigurationPopup 
              selectedAgent={selectedAgent}
              socialAgents={socialAgents}
              closeAgentPopup={closeAgentPopup}
              handleAgentChange={handleAgentChange}
              saveAgentConfig={saveAgentConfig}
              tokenName={tokenData.name}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default ListTokenPage