import { Representative } from '../types'

export const Card = ({ rep }: { rep: Representative }) => {
  return (
    <div className='card'>
      <div className='card-header'>
        <h2>{rep.name}</h2>
        {rep.party.length && <p>{rep.party}</p>}
      </div>
      <div className='card-body'>
        {rep.state.length &&
          <div>
            <label>State:</label>
            <span>{rep.state}</span>
          </div>
        }
        {rep.phone.length &&
          <div>
            <label>Phone:</label>
            <a target="_blank" rel="noreferrer" href={`tel:${rep.phone}`}>{rep.phone}</a>
          </div>
        }
        {rep.link.length &&
          <div>
            <label>Website:</label>
            <a target="_blank" rel="noreferrer" href={rep.link}>{rep.link}</a>
          </div>
        }

        {rep.office.length &&
          <div>
            <label>Address:</label>
            <address>{rep.office}</address>
          </div>
        }
      </div>
    </div>
  )
}
