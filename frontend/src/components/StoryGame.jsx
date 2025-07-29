import { useState, useEffect } from 'react';
import StreamingText from './StreamingText';
import './StreamingText.css';

function StoryGame({story, onNewStory}) {
    const [currentNodeId, setCurrentNodeId] = useState(null);
    const [currentNode, setCurrentNode] = useState(null)
    const [options, setOptions] = useState([])
    const [isEnding, setIsEnding] = useState(false)
    const [isWinningEnding, setIsWinningEnding] = useState(false)
    const [showOptions, setShowOptions] = useState(false)

    useEffect(() => {
        if (story && story.root_node) {
            const rootNodeId = story.root_node.id
            setCurrentNodeId(rootNodeId)
        }
    }, [story])

    useEffect(() => {
        if (currentNodeId && story && story.all_nodes) {
            const node = story.all_nodes[currentNodeId]
            setShowOptions(false)
            setCurrentNode(node)
            setIsEnding(node.is_ending)
            setIsWinningEnding(node.is_winning_ending)

            if (!node.is_ending && node.options && node.options.length > 0) {
                setOptions(node.options)
            } else {
                setOptions([])
            }
        }
    }, [currentNodeId, story])

    const handleTextComplete = () => {
        setShowOptions(true)
    }


    const chooseOption = (optionId) => {
        setCurrentNodeId(optionId)
    }

    const restartStory = () => {
        if (story && story.root_node) {
            setShowOptions(false);
            setCurrentNode(null);  // Clear current node first
            setOptions([]);
            // Use setTimeout to ensure state updates before setting new node
            setTimeout(() => {
                setCurrentNodeId(story.root_node.id);
            }, 0);
        }
    }

    return <div className="story-game">
        <header className="story-header">
            <h2>{story.title}</h2>
        </header>

        <div className="story-content">
            {currentNode && (
                <div className="story-node">
                    <StreamingText 
                        text={currentNode?.content || ''}
                        speed={32}
                        onComplete={handleTextComplete}
                    />

                    {showOptions && (
                        isEnding ? (
                            <div className="story-ending fade-in">
                                <h3>{isWinningEnding ? "Congratulations" : "The End"}</h3>
                                <p>{isWinningEnding ? "You reached a winning ending" : "Your adventure has ended."}</p>
                            </div>
                        ) : (
                            <div className="story-options fade-in">
                                <h3>What will you do?</h3>
                                <div className="options-list">
                                    {options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => chooseOption(option.node_id)}
                                            className="option-btn"
                                        >
                                            {option.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}

            <div className="story-controls">
                <button onClick={restartStory} className="reset-btn">
                    Restart Story
                </button>
            </div>

            {onNewStory && <button onClick={onNewStory} className="new-story-btn">
                New Story
            </button>}

        </div>
    </div>
}

export default StoryGame